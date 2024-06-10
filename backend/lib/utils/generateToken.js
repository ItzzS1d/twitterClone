
import jwt from "jsonwebtoken";

export const gereateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.cookie("jwt", token, {

    maxAge: new Date(Date.now() + 7 * 24 * 60 * 1000),
    httpOnly : true, //prevent xss attacks
    //csrf attacks
    secure: process.env.NODE_ENV === "production", //only send cookie over https
    
  


  });
};
