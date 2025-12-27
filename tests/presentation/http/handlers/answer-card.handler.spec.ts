

import { isUUID } from "validator";
import {AnswerCardHandler} from "../../../../src/presentation/http/handlers/cards/answer-card.handler";
import {AnswerCardService} from "../../../../src/application/services/answer-card-service";
import {CardNotFoundError} from "../../../../src/domain/errors/card-not-found-error";

jest.mock("validator", () => ({
    isUUID: jest.fn(),
}));

type MockReq = {
    params?: any;
    body?: any;
};

function makeRes() {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
}

describe("AnswerCardHandler", () => {
    let answerCardService: { execute: jest.Mock };
    let handler: AnswerCardHandler;

    beforeEach(() => {
        jest.clearAllMocks();

        answerCardService = {
            execute: jest.fn(),
        };

        handler = new AnswerCardHandler(answerCardService as unknown as AnswerCardService);

        // Default: UUID valid
        (isUUID as unknown as jest.Mock).mockReturnValue(true);
    });

    it("should return 204 when request is valid and service succeeds", async () => {
        const req: MockReq = {
            params: { cardId: "550e8400-e29b-41d4-a716-446655440000" },
            body: { isValid: true },
        };
        const res = makeRes();

        await handler.handle(req as any, res as any);

        expect(answerCardService.execute).toHaveBeenCalledTimes(1);
        expect(answerCardService.execute).toHaveBeenCalledWith(
            "550e8400-e29b-41d4-a716-446655440000",
            true
        );

        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.send).toHaveBeenCalledWith();
        expect(res.json).not.toHaveBeenCalled();
    });

    it("should return 400 when isValid is missing", async () => {
        const req: MockReq = {
            params: { cardId: "550e8400-e29b-41d4-a716-446655440000" },
            body: {},
        };
        const res = makeRes();

        await handler.handle(req as any, res as any);

        expect(answerCardService.execute).not.toHaveBeenCalled();

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: expect.stringMatching(/isValid must be boolean/i),
        });
    });

    it("should return 400 when isValid is not boolean", async () => {
        const req: MockReq = {
            params: { cardId: "550e8400-e29b-41d4-a716-446655440000" },
            body: { isValid: "true" }, // invalid
        };
        const res = makeRes();

        await handler.handle(req as any, res as any);

        expect(answerCardService.execute).not.toHaveBeenCalled();

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: expect.stringMatching(/isValid must be boolean/i),
        });
    });

    it("should return 400 when cardId is not a valid UUID", async () => {
        (isUUID as unknown as jest.Mock).mockReturnValue(false);

        const req: MockReq = {
            params: { cardId: "not-a-uuid" },
            body: { isValid: true },
        };
        const res = makeRes();

        await handler.handle(req as any, res as any);

        expect(answerCardService.execute).not.toHaveBeenCalled();

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: expect.stringMatching(/Invalid cardId format/i),
        });
    });

    it("should return 404 when service throws CardNotFoundError", async () => {
        answerCardService.execute.mockRejectedValue(new CardNotFoundError());

        const req: MockReq = {
            params: { cardId: "550e8400-e29b-41d4-a716-446655440000" },
            body: { isValid: false },
        };
        const res = makeRes();

        await handler.handle(req as any, res as any);

        expect(answerCardService.execute).toHaveBeenCalledTimes(1);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: expect.any(String),
        });
    });

    it("should return 500 when service throws an unexpected error", async () => {
        answerCardService.execute.mockRejectedValue(new Error("boom"));

        const req: MockReq = {
            params: { cardId: "550e8400-e29b-41d4-a716-446655440000" },
            body: { isValid: true },
        };
        const res = makeRes();

        await handler.handle(req as any, res as any);

        expect(answerCardService.execute).toHaveBeenCalledTimes(1);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: "internal error",
        });
    });
});
