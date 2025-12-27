import { Request, Response } from 'express';
import { PatchNotificationSettingsHandler } from '../../../../src/presentation/http/handlers/notification/update-notification-settings.handler';
import { UpdateNotificationSettingsService } from '../../../../src/application/services/notification/update-notification-settings-service';
import { updateNotificationSettingsValidation } from '../../../../src/presentation/http/validators/update-notification-settings.validator';

function makeRes() {
    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res as Response;
}

describe('PatchNotificationSettingsHandler', () => {
    const mockUpdateSettings = {
        execute: jest.fn(),
    } as unknown as UpdateNotificationSettingsService;

    let handler: PatchNotificationSettingsHandler;

    beforeEach(() => {
        jest.clearAllMocks();
        handler = new PatchNotificationSettingsHandler(mockUpdateSettings);
    });

    it('should return 400 if body is an array', async () => {
        const req = { body: [] } as unknown as Request;
        const res = makeRes();

        await handler.handle(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Body must be an object' });
        expect(mockUpdateSettings.execute).not.toHaveBeenCalled();
    });

    it('should return 400 if validation fails', async () => {
    const invalidBody = { enabled: 'not-boolean' };
    const req = { body: invalidBody } as unknown as Request;
    const res = makeRes();

    await handler.handle(req, res);
    const expectedMessage = require('../../../../src/presentation/http/validators/generate-validation-message')
        .generateValidationErrorMessage(
            updateNotificationSettingsValidation.validate(invalidBody).error!.details
        );

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expectedMessage);
    expect(mockUpdateSettings.execute).not.toHaveBeenCalled();
});


    it('should call service and return 204 on valid input', async () => {
        const validBody = {
            userId: 'user-1',
            enabled: true,
            timeOfDay: '08:30',
            timezone: 'Europe/Paris'
        };
        const req = { body: validBody } as unknown as Request;
        const res = makeRes();

        await handler.handle(req, res);

        expect(mockUpdateSettings.execute).toHaveBeenCalledWith(validBody);
        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.send).toHaveBeenCalled();
    });

    it('should allow partial update', async () => {
        const partialBody = {
            userId: 'user-2',
            timezone: 'UTC'
        };
        const req = { body: partialBody } as unknown as Request;
        const res = makeRes();

        await handler.handle(req, res);

        expect(mockUpdateSettings.execute).toHaveBeenCalledWith(partialBody);
        expect(res.status).toHaveBeenCalledWith(204);
    });
});
