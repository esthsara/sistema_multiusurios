import { useState, useEffect, useCallback } from 'react'
import { toast }             from 'react-toastify'
import { auditoriaService }  from '../services/auditoria.service'
import { useTableState }     from '@/shared/hooks/useTableState'
import type { AuditoriaListItem, AuditoriaFilters } from '../types/auditoria.types'

export const useAuditoria = () => {
  const [data,     setData]     = useState<AuditoriaListItem[]>([])
  const [total,    setTotal]    = useState(0)
  const [loading,  setLoading]  = useState(false)
  const [acciones, setAcciones] = useState<string[]>([])
  const [entidades, setEntidades] = useState<{ value: string; label: string }[]>([])

  const table = useTableState<AuditoriaFilters>({
    usuario_id:   '',
    accion:       '',
    entidad_type: '',
    fecha_inicio: '',
    fecha_fin:    '',
  })

  const fetchAuditoria = useCallback(async () => {
    setLoading(true)
    try {
      const res = await auditoriaService.getAll(table.toParams())
      setData(res.data)
      setTotal(res.meta.total)
    } catch {
      toast.error('Error al cargar auditoría')
    } finally {
      setLoading(false)
    }
  }, [table.toParams])

  const fetchFiltros = useCallback(async () => {
    try {
      const [accionesRes, entidadesRes] = await Promise.all([
        auditoriaService.getAcciones(),
        auditoriaService.getEntidades(),
      ])
      setAcciones(accionesRes.data.map(a => a.value))
      setEntidades(entidadesRes.data)
    } catch { /* silencioso */ }
  }, [])

  useEffect(() => {
    fetchAuditoria()
    fetchFiltros()
  }, [fetchAuditoria, fetchFiltros])

  const exportar = async () => {
    try {
      const res = await auditoriaService.exportar()
      toast.success(`${res.data.total} registros exportados`)
      return res.data
    } catch {
      toast.error('Error al exportar auditoría')
      return null
    }
  }

  return {
    data, total, loading,
    table, acciones, entidades,
    fetchAuditoria, exportar,
  }
}