import { Response } from 'express';
import { handleHttpError } from '../../../../src/presentation/http/errors/http-error-handler';

function makeRes() {
    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res as Response;
}

describe('handleHttpError', () => {
    it('should return 500 and internal error for unknown Error instances', () => {
        const res = makeRes();
        const err = new Error('some unexpected error');

        handleHttpError(res, err);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'internal error' });
    });

    it('should return 500 and internal error for non-error values', () => {
        const res = makeRes();
        const err = 'just a string' as unknown;

        handleHttpError(res, err);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'internal error' });
    });
});
