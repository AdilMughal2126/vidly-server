import supertest from "supertest";
import { generateAuthToken } from "../../../helpers/auth";
import { Feedback } from "../../../models/feedback";
import { User } from "../../../models/user";
import { app } from "../../../server";
import { FeedbackType } from "../../../types/FeedbackType";

const request = supertest(app);

describe("Route /api/feedbacks", () => {
	let token: string;
	let feedback1: FeedbackType;
	let feedback2: FeedbackType;

	afterEach(async () => await Feedback.deleteMany({}));
	beforeEach(async () => {
		feedback1 = { subject: "UI", message: "Looking good!" };
		feedback2 = {
			subject: "Errors",
			message: "Nice tooltip and transition when displaying error messages:)",
		};
		await Feedback.create(feedback1, feedback2);
		token = generateAuthToken(new User());
	});

	/**
	 * @route /api/feedbacks
	 * @method GET
	 * @access Public
	 * @return 403 if user is not admin
	 * @return all the feedbacks
	 */

	describe("GET /", () => {
		const exec = () => request.get("/api/feedbacks").set("X-Auth-Token", token);

		it("should return 403 if user is not admin", async () => {
			const res = await exec();
			expect(res.status).toBe(403);
			expect(res.body).toMatch(/access denied/i);
		});

		it("should return all the feedbacks", async () => {
			token = generateAuthToken(new User({ isAdmin: true }));
			const res = await exec();
			expect(res.status).toBe(200);
			expect(res.body).toHaveLength(2);
		});
	});

	/**
	 * @route /api/feedbacks
	 * @method POST
	 * @access Public
	 * @return 400 if subject if greater than 300 characters
	 * @return 400 if message if greater than 500 characters
	 * @return 200 if feedback is valid
	 */

	describe("POST /", () => {
		const exec = () => request.post("/api/feedbacks").send(feedback1);

		it("should return 400 if subject if greater than 300 characters", async () => {
			feedback1.subject = Array(400).join("a");
			const res = await exec();
			expect(res.status).toBe(400);
			expect(res.body).toMatch(/must be less than or equal to 300 characters/i);
		});

		it("should return 400 if message if greater than 500 characters", async () => {
			feedback1.message = Array(510).join("a");
			const res = await exec();
			expect(res.status).toBe(400);
			expect(res.body).toMatch(/must be less than or equal to 500 characters/i);
		});

		it("should return 200 if feedback is valid", async () => {
			const res = await exec();
			expect(res.status).toBe(200);
			expect(res.body).toMatch(/thanks for your feedback/i);
		});
	});
});
