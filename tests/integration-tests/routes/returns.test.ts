import { Rental } from "../../../models/rental";
import mongoose from "mongoose";
import { RentalType } from "../../../types/RentalType";
import supertest from "supertest";
import { app } from "../../../server";
import { generateAuthToken } from "../../../helpers/auth";
import { User } from "../../../models/user";

const request = supertest(app);

describe("Route /api/returns", () => {
  let rental: RentalType;
  let token: string;
  let customerId: string;
  let movieId: string;
  let id: string;

  beforeEach(async () => {
    token = generateAuthToken(new User());
    movieId = new mongoose.Types.ObjectId().toHexString();
    customerId = new mongoose.Types.ObjectId().toHexString();
    rental = await Rental.create({
      customer: {
        _id: customerId,
        name: "Takanome",
        phone: "77000000",
      },
      movie: {
        _id: movieId,
        title: "Avengers",
        dailyRentalRate: 2,
      },
    });
  });
  afterEach(async () => {
    await Rental.deleteMany({});
  });

  const exec = () =>
    request
      .post("/api/returns")
      .set("X-Auth-Token", token)
      .send({ customerId, movieId });

  it("should return 401 if no jwt was provided", async () => {
    token = "";
    const res = await exec();
    expect(res.status).toBe(401);
  });

  it("should return 400 if no customerId was provided", async () => {
    customerId = "";
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 400 if no movieId was provided", async () => {
    movieId = "";
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 404 if no rental was found", async () => {
    await Rental.deleteMany({});
    const res = await exec();
    expect(res.status).toBe(404);
  });

  it("should return 400 if rental already prossesses", async () => {
    // rental.dateReturned = new Date()
    await Rental.updateOne(
      { "customer._id": customerId, "movie._id": movieId },
      { dateReturned: new Date() }
    );
    const res = await exec();
    expect(res.status).toBe(400);
  });
});

/**
 * @route POST /api/returns
 *
 * Return 401 if user is not logged in
 * Return 400 if no customerId was provided
 * Return 400 if no movieId was provided
 * Return 404 if no rental was found
 * Return 400 if rental already prossesses
 * Return 200 if input is valid
 * Record date returned
 * Calculate rental fee
 * return rental info
 */
