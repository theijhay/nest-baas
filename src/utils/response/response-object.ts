export class ResponseObject<T> {
    success: boolean;
    message: string;
    data?: T;
    error?: any;
  
    constructor(partial: Partial<ResponseObject<T>>) {
      Object.assign(this, partial);
    }
  }
  
  export const successResponse = (message: string, data?: any) =>
    new ResponseObject({ success: true, message, data });
  
  export const errorResponse = (message: string, error?: any) =>
    new ResponseObject({ success: false, message, error });

export function transformUser(user: any) {
    if (!user) return null;
    return {
      id: user.id,
      email: user.email,
      is_active: user.is_active,
      is_verified: user.is_verified,
      created_at: user.created_at,
      updated_at: user.updated_at,
      last_login_at: user.last_login_at || null,
    };
  }
  