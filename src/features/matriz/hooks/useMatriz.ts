// src/features/roles-permisos/hooks/useMatriz.ts
import { useState, useEffect, useCallback, useMemo } from 'react'
import { toast }           from 'react-toastify'
import { permisosService } from '../services/permiso.service'
import { rolesService }    from '../services/roles.service'
import type { PermisosPorModulo } from '../types/permiso.types'
import type { RolListItem, RolDetalle } from '../types/rol.types'

/**
 * MatrizCell — Estado de una celda en la matriz.
 * rolId × permisoId → tiene o no tiene el permiso
 */
type MatrizState = Record<number, Set<number>>
// MatrizState[rolId] = Set de permisoIds que tiene ese rol

/**
 * PendingChange — Cambio pendiente de guardar
 */
interface PendingChange {
  rolId:      number
  permisoId:  number
  action:     'add' | 'remove'
}

export const useMatriz = () => {
  const [roles,         setRoles]        = useState<RolListItem[]>([])
  const [rolesDetalle,  setRolesDetalle] = useState<RolDetalle[]>([])
  const [permisosPorModulo, setPermisosPorModulo] = useState<PermisosPorModulo>({})
  const [loading,       setLoading]      = useState(false)
  const [saving,        setSaving]       = useState(false)

  /**
   * matrizOriginal — estado guardado en el backend
   * matrizLocal    — estado con cambios pendientes
   */
  const [matrizOriginal, setMatrizOriginal] = useState<MatrizState>({})
  const [matrizLocal,    setMatrizLocal]    = useState<MatrizState>({})

  /* Filtros locales */
  const [searchTerm,    setSearchTerm]    = useState('')
  const [moduloFiltro,  setModuloFiltro]  = useState<string>('todos')
  const [rolFiltro,     setRolFiltro]     = useState<string>('todos')

  /* ── Carga inicial ── */
  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      /**
       * Cargamos en paralelo:
       * 1. Lista de roles
       * 2. Permisos agrupados por módulo
       * 3. Detalle de cada rol (para saber sus permisos actuales)
       */
      const [rolesRes, permisosRes] = await Promise.all([
        rolesService.getAll(),
        permisosService.getAgrupados(),
      ])

      const rolesList = rolesRes.data.items
      setRoles(rolesList)
      setPermisosPorModulo(permisosRes.data)

      /* Cargar detalle de cada rol para obtener sus permisos */
      const detalles = await Promise.all(
        rolesList.map(r => rolesService.getById(r.id))
      )
      const detallesData = detalles.map(d => d.data)
      setRolesDetalle(detallesData)

      /* Construir estado inicial de la matriz */
      const estadoInicial: MatrizState = {}
      detallesData.forEach(rol => {
        estadoInicial[rol.id] = new Set(
          rol.permissions.map(p => p.id)
        )
      })

      setMatrizOriginal(estadoInicial)
      setMatrizLocal(deepCopyMatriz(estadoInicial))

    } catch {
      toast.error('Error al cargar la matriz')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  /* ── Helpers ── */

  const deepCopyMatriz = (m: MatrizState): MatrizState => {
    const copy: MatrizState = {}
    Object.entries(m).forEach(([rolId, permisoSet]) => {
      copy[Number(rolId)] = new Set(permisoSet)
    })
    return copy
  }

  /* ── Toggle de una celda ── */
  const togglePermiso = useCallback((rolId: number, permisoId: number) => {
    setMatrizLocal(prev => {
      const copy = deepCopyMatriz(prev)
      if (!copy[rolId]) copy[rolId] = new Set()

      if (copy[rolId].has(permisoId)) {
        copy[rolId].delete(permisoId)
      } else {
        copy[rolId].add(permisoId)
      }
      return copy
    })
  }, [])

  /* ── Calcular cambios pendientes ── */
  const pendingChanges = useMemo((): PendingChange[] => {
    const changes: PendingChange[] = []

    Object.keys(matrizLocal).forEach(rolIdStr => {
      const rolId       = Number(rolIdStr)
      const localSet    = matrizLocal[rolId]  ?? new Set<number>()
      const originalSet = matrizOriginal[rolId] ?? new Set<number>()

      localSet.forEach(permisoId => {
        if (!originalSet.has(permisoId)) {
          changes.push({ rolId, permisoId, action: 'add' })
        }
      })

      originalSet.forEach(permisoId => {
        if (!localSet.has(permisoId)) {
          changes.push({ rolId, permisoId, action: 'remove' })
        }
      })
    })

    return changes
  }, [matrizLocal, matrizOriginal])

  /* ── Verificar si una celda tiene cambio pendiente ── */
  const hasPendingChange = useCallback((rolId: number, permisoId: number): boolean => {
    const localHas    = matrizLocal[rolId]?.has(permisoId) ?? false
    const originalHas = matrizOriginal[rolId]?.has(permisoId) ?? false
    return localHas !== originalHas
  }, [matrizLocal, matrizOriginal])

  /* ── Descartar cambios ── */
  const discardChanges = useCallback(() => {
    setMatrizLocal(deepCopyMatriz(matrizOriginal))
  }, [matrizOriginal])

  /* ── Guardar cambios ── */
  const saveChanges = useCallback(async () => {
    setSaving(true)
    try {
      /**
       * Agrupamos los cambios por rol y hacemos
       * un syncPermissions por cada rol modificado.
       * syncPermissions reemplaza TODOS los permisos del rol.
       */
      const rolesModificados = new Set(pendingChanges.map(c => c.rolId))

      await Promise.all(
        Array.from(rolesModificados).map(rolId => {
          const permisosIds = Array.from(matrizLocal[rolId] ?? new Set())
          return rolesService.syncPermissions(rolId, { permissions: permisosIds })
        })
      )

      /* Actualizar el estado original con lo que se guardó */
      setMatrizOriginal(deepCopyMatriz(matrizLocal))
      toast.success(`${pendingChanges.length} cambios guardados correctamente`)
    } catch {
      toast.error('Error al guardar los cambios')
    } finally {
      setSaving(false)
    }
  }, [pendingChanges, matrizLocal])

  /* ── Contar permisos por rol por módulo (para el header de columna) ── */
  const getCountForRole = useCallback((rolId: number): number => {
    return matrizLocal[rolId]?.size ?? 0
  }, [matrizLocal])

  const getTotalPermisos = useMemo((): number => {
    return Object.values(permisosPorModulo).reduce(
      (acc, permisos) => acc + permisos.length, 0
    )
  }, [permisosPorModulo])

  /* ── Datos filtrados ── */
  const modulosFiltrados = useMemo(() => {
    let modulos = Object.entries(permisosPorModulo)

    if (moduloFiltro !== 'todos') {
      modulos = modulos.filter(([mod]) => mod === moduloFiltro)
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      modulos = modulos
        .map(([mod, permisos]) => [
          mod,
          permisos.filter(p =>
            p.name.toLowerCase().includes(term) ||
            p.accion.toLowerCase().includes(term) ||
            mod.toLowerCase().includes(term)
          ),
        ] as [string, typeof permisos])
        .filter(([, permisos]) => permisos.length > 0)
    }

    return modulos
  }, [permisosPorModulo, moduloFiltro, searchTerm])

  const rolesFiltrados = useMemo(() => {
    if (rolFiltro === 'todos') return roles
    return roles.filter(r => String(r.id) === rolFiltro)
  }, [roles, rolFiltro])

  return {
    /* Datos */
    roles,
    rolesFiltrados,
    rolesDetalle,
    permisosPorModulo,
    modulosFiltrados,
    getTotalPermisos,
    /* Estado matriz */
    matrizLocal,
    matrizOriginal,
    /* Cambios */
    pendingChanges,
    hasPendingChange,
    togglePermiso,
    discardChanges,
    saveChanges,
    getCountForRole,
    /* UI */
    loading,
    saving,
    /* Filtros */
    searchTerm,     setSearchTerm,
    moduloFiltro,   setModuloFiltro,
    rolFiltro,      setRolFiltro,
  }
}