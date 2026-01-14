interface ApiError {
  error: {
    code: string;
    message: string;
    details?: string[];
  };
}

export function getErrorMessage(error: any): string {
  // Si es un error de axios con response
  if (error.response?.data) {
    const data = error.response.data as ApiError;

    // Si tiene estructura de tu API
    if (data.error) {
      // Si hay detalles (errores de validación), mostrar el primero
      if (data.error.details && data.error.details.length > 0) {
        return data.error.details[0];
      }
      // Si no, mostrar el mensaje principal
      return data.error.message;
    }

    // Fallback: si tiene message directo
    if (typeof data === 'object' && 'message' in data) {
      return (data as any).message;
    }
  }

  // Error de red u otro
  if (error.message) {
    return error.message;
  }

  return 'Error desconocido';
}