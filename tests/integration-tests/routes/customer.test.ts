/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import supertest from "supertest";
import mongoose from "mongoose";
import { app } from "../../../server";
import { User } from "../../../models/user";
import { Customer } from "../../../models/customer";
import { CustomerType } from "../../../types/CustomerType";
import { generateAuthToken } from "../../../helpers/auth";

const request = supertest(app);

describe("Route /api/customers", () => {
  afterEach(async () => await Customer.deleteMany({}));

  describe("GET /", () => {
    it("should return all the customers", async () => {
      const customers = [
        { name: "Takanome", phone: "703696056" },
        { name: "WesBos", phone: "788636071" },
      ];

      await Customer.create(customers);
      const res = await request.get("/api/customers");
      expect(res.status).toBe(200);
      expect(res.body[0]).toHaveProperty("name", "Takanome");
      expect(res.body[1]).toHaveProperty("name", "WesBos");
    });
  });

  describe("GET /:id", () => {
    let id: string;
    let customer: mongoose.Document<unknown, unknown, CustomerType> & {
      _id: mongoose.Types.ObjectId;
    };

    beforeEach(async () => {
      customer = await Customer.create({
        name: "Mugiwara",
        phone: "760000000",
      });
      id = customer._id.toHexString();
    });

    const exec = () => request.get(`/api/customers/${id}`);

    it("should return 404 if ID is invalid", async () => {
      id = "1";
      const res = await exec();
      expect(res.status).toBe(404);
      expect(res.body).toMatch(/invalid id/i);
    });

    it("should return 404 if customer is not found", async () => {
      id = "61dd6dd371aa041cf91f7363";
      const res = await exec();
      expect(res.status).toBe(404);
      expect(res.body).toMatch(/not found/i);
    });

    it("should return 200 if customer is found", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject(customer.toJSON());
    });
  });

  describe("POST /", () => {
    let token: string;
    let customer: CustomerType;

    beforeEach(() => {
      const user = new User();
      token = generateAuthToken(user);
      customer = {
        name: "Developer",
        phone: "338446908",
        isGold: true,
      };
    });

    const exec = () =>
      request.post("/api/customers").set("X-Auth-Token", token).send(customer);

    it("should return 401 if user is not logged in", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
      expect(res.body).toMatch(/access denied/i);
    });

    it("should return 400 if customer is invalid", async () => {
      customer.name = "Dev";
      const res = await exec();
      expect(res.status).toBe(400);
      expect(res.body).toMatch(/must be at least 5/i);
    });

    it("should save customer if valid", async () => {
      const res = await exec();
      const newCustomer = await Customer.findById(res.body._id);
      expect(newCustomer).not.toBeNull();
    });

    it("should return the new customer if valid", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject(customer);
    });
  });

  describe("PUT - DELETE", () => {
    let id: string;
    let token: string;
    let customer: CustomerType;

    beforeEach(async () => {
      const user = new User();
      token = generateAuthToken(user);
      customer = {
        name: "Developer",
        phone: "338446908",
        isGold: true,
      };

      const newCustomer = await Customer.create(customer);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      id = newCustomer._id;
    });

    describe("PUT /:id", () => {
      const exec = () =>
        request
          .put(`/api/customers/${id}`)
          .set("X-Auth-Token", token)
          .send(customer);

      it("should return 404 if ID is invalid", async () => {
        id = "1";
        const res = await exec();
        expect(res.status).toBe(404);
        expect(res.body).toMatch(/invalid id/i);
      });

      it("should return 401 if user is not logged in", async () => {
        token = "";
        const res = await exec();
        expect(res.status).toBe(401);
        expect(res.body).toMatch(/access denied/i);
      });

      it("should return 400 if customer is invalid", async () => {
        customer.phone = "777";
        const res = await exec();
        expect(res.status).toBe(400);
        expect(res.body).toMatch(/must be at least 8/i);
      });

      it("should return 404 if customer not found", async () => {
        id = "61dd6dd371aa041cf91f7363";
        const res = await exec();
        expect(res.status).toBe(404);
        expect(res.body).toMatch(/not found/i);
      });

      it("should save customer if valid", async () => {
        customer.name = "React Dev";
        const res = await exec();
        const updatedCustomer = await Customer.findById(res.body._id);
        expect(updatedCustomer).not.toBeNull();
      });

      it("should save customer if valid", async () => {
        customer.name = "React Dev";
        const res = await exec();
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("name", "React Dev");
      });
    });

    describe("DELETE /", () => {
      const exec = () =>
        request.delete(`/api/customers/${id}`).set("X-Auth-Token", token);

      it("should return 404 if ID is invalid", async () => {
        id = "1";
        const res = await exec();
        expect(res.status).toBe(404);
        expect(res.body).toMatch(/invalid id/i);
      });

      it("should return 403 if user is not admin", async () => {
        const res = await exec();
        expect(res.status).toBe(403);
        expect(res.body).toMatch(/access denied/i);
      });

      it("should return 404 if customer is not found", async () => {
        id = "61dd6dd371aa041cf91f7363";
        token = generateAuthToken(new User({ isAdmin: true }));
        const res = await exec();
        expect(res.status).toBe(404);
        expect(res.body).toMatch(/not found/i);
      });

      it("should delete customer if valid", async () => {
        token = generateAuthToken(new User({ isAdmin: true }));
        const res = await exec();
        const deletedCustomer = await Customer.findById(res.body._id);
        expect(deletedCustomer).toBeNull();
      });

      it("should return the deleted customer if valid", async () => {
        token = generateAuthToken(new User({ isAdmin: true }));
        const res = await exec();
        expect(res.status).toBe(200);
        expect(res.body).toMatchObject(customer);
      });
    });
  });
});
