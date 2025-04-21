export function formatValidationErrors(validationErrors: any[]) {
    return validationErrors.reduce((acc, err) => {
      acc[err.property] = Object.values(err.constraints || {});
      return acc;
    }, {});
  }
  