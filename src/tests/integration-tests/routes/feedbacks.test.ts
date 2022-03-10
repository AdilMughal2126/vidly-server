import supertest from "supertest";
import { Feedback } from "../../../models/feedback";
import { app } from "../../../server";
import { FeedbackType } from "../../../types/FeedbackType";

const request = supertest(app);

describe("Route /api/feedbacks", () => {
	let feedback1: FeedbackType;
	let feedback2: FeedbackType;

	afterEach(async () => await Feedback.deleteMany({}));
	beforeEach(async () => {
		feedback1 = { subject: "UI", message: "Looking good!" };
		feedback2 = {
			subject: "Errors",
			message: "Nice tooltip and transition when displaying error messages:)",
		};
		await Feedback.insertMany([feedback1, feedback2]);
	});

	/**
	 *  @route /api/feedbacks
	 * @method GET
	 * @access Public
	 * @return all the feedbacks
	 */

	describe("GET /", () => {
		it("should return all the feedbacks", async () => {
			const res = await request.get("/api/feedbacks");
			expect(res.status).toBe(200);
			expect(res.body).toHaveLength(2);
		});
	});
});
