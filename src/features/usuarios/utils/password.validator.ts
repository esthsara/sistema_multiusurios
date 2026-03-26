// src/features/usuarios/utils/password.validator.ts
/**
 * Reglas de seguridad para contraseñas:
 * - Mínimo 8 caracteres
 * - Al menos 1 mayúscula
 * - Al menos 1 minúscula
 * - Al menos 1 número
 * - Al menos 1 carácter especial (!@#$%^&*)
 */

interface PasswordValidationResult {
  valid: boolean;
  errors: string[];
  strength: "weak" | "fair" | "good" | "strong";
}

export const validatePassword = (
  password: string,
): PasswordValidationResult => {
  const errors: string[] = [];
  let strengthScore = 0;

  // Validación de longitud
  if (password.length < 8) {
    errors.push("La contraseña debe tener al menos 8 caracteres");
  } else {
    strengthScore++;
  }

  // Validación de mayúsculas
  if (!/[A-Z]/.test(password)) {
    errors.push("Debe contener al menos una letra mayúscula");
  } else {
    strengthScore++;
  }

  // Validación de minúsculas
  if (!/[a-z]/.test(password)) {
    errors.push("Debe contener al menos una letra minúscula");
  } else {
    strengthScore++;
  }

  // Validación de números
  if (!/\d/.test(password)) {
    errors.push("Debe contener al menos un número");
  } else {
    strengthScore++;
  }

  // Validación de caracteres especiales
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push(
      "Debe contener al menos un carácter especial (!@#$%^&*()_+-=[]{};\\':\\\\|,.<>/?)",
    );
  } else {
    strengthScore++;
  }

  // Determinar fortaleza
  let strength: PasswordValidationResult["strength"] = "weak";
  if (strengthScore === 5) {
    strength = "strong";
  } else if (strengthScore >= 4) {
    strength = "good";
  } else if (strengthScore >= 2) {
    strength = "fair";
  }

  return {
    valid: errors.length === 0,
    errors,
    strength,
  };
};

/**
 * Genera una contraseña temporal segura
 * Formato: TMP_[12 caracteres aleatorios]_[6 dígitos aleatorios]!
 * Ejemplo: TMP_aB3cDeF9gH5j_123456!
 */
export const generateTemporaryPassword = (): string => {
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const special = "!@#$%^&*";

  let password = "";
  password += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
  password += lowercase.charAt(Math.floor(Math.random() * lowercase.length));

  for (let i = 0; i < 10; i++) {
    const random = Math.random();
    if (random < 0.4) {
      password += uppercase.charAt(
        Math.floor(Math.random() * uppercase.length),
      );
    } else if (random < 0.7) {
      password += lowercase.charAt(
        Math.floor(Math.random() * lowercase.length),
      );
    } else {
      password += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
  }

  password += numbers.charAt(Math.floor(Math.random() * numbers.length));
  password += special.charAt(Math.floor(Math.random() * special.length));

  return password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
};

/**
 * Calcula la entropía de una contraseña (log2)
 * Útil para determinar fortaleza adicional
 */
export const calculatePasswordEntropy = (password: string): number => {
  let charsetSize = 0;

  if (/[a-z]/.test(password)) charsetSize += 26;
  if (/[A-Z]/.test(password)) charsetSize += 26;
  if (/\d/.test(password)) charsetSize += 10;
  if (/[^a-zA-Z0-9]/.test(password)) charsetSize += 32; // Caracteres especiales aproximados

  return password.length * Math.log2(charsetSize);
};
