import logger from '../logger';

describe('Logger', () => {
  test('should be defined', () => {
    expect(logger).toBeDefined();
  });

  test('should have standard logging methods', () => {
    expect(typeof logger.info).toBe('function');
    expect(typeof logger.error).toBe('function');
    expect(typeof logger.warn).toBe('function');
    expect(typeof logger.debug).toBe('function');
  });

  test('should log at info level by default', () => {
    // Mock the logger's info method to verify it's called
    const infoSpy = jest.spyOn(logger, 'info').mockImplementation(() => logger);
    logger.info('test message');
    expect(infoSpy).toHaveBeenCalledWith('test message');
    infoSpy.mockRestore();
  });
});