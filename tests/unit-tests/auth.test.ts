import mongoose from "mongoose";
import { generateAuthToken, verifyToken } from "../../helpers/auth";
import { User } from "../../models/user";

describe("Auth Helper", () => {
  it("should return a valid token", () => {
    const payload = {
      _id: new mongoose.Types.ObjectId(),
      isAdmin: true,
    };
    const user = new User(payload);
    const token = generateAuthToken(user);
    const decoded = verifyToken(token);

    expect(decoded).toMatchObject(payload);
  });
});
