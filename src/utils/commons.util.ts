import * as JWT from "jsonwebtoken";

export default class CommonUtil {
  static verifyToken = async (
    token: string,
    secretKey: string
  ): Promise<any> => {
    try {
      return JWT.verify(token, secretKey);
    } catch (error) {
      console.log("error ", error);
      throw error;
    }
  };

  static generateToken = async (
    data: Record<string, any>,
    expiresIn: string,
    secretKey: string
  ): Promise<string> => {
    const key = secretKey;
    const expire = expiresIn as JWT.SignOptions['expiresIn'];
    return new Promise((resolve, reject) => {
      JWT.sign(
        { ...data },
        key,
        {
          expiresIn: expire,
        },
        (err, token) => {
          if (err) {
            console.error("Error generating token: ", err);
            reject(err);
          } else {
            resolve(token);
          }
        }
      );
    });
  };
}