import JWT from "jsonwebtoken";
import bcrypt from "bcrypt";

interface TokenCreationProp {
  email: string;
  secret: string;
  options?: any;
}

export const signAsync = ({ email, secret, options }: TokenCreationProp) => {
  return new Promise((resolve, reject) => {
    JWT.sign({ email }, secret, { expiresIn: "24h" }, (err, token) => {
      if (err) {
        reject(err);
      } else {
        resolve(token);
      }
    });
  });
};

//

// Function to verify a password
export const verifyPassword = async (
  inputPassword: string,
  hashedPassword: string
) => {
  try {
    const passwordMatch = await bcrypt.compare(inputPassword, hashedPassword);
    return passwordMatch;
  } catch (error) {
    return error;
  }
};
