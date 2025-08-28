import { describe, it, expect } from '@jest/globals'
import { AppError } from '../appError.js'

describe('AppError', () => {
  it('should create an error with message and status code', () => {
    const message = 'Test error message'
    const statusCode = 400
    
    const error = new AppError(message, statusCode)
    
    expect(error.message).toBe(message)
    expect(error.statusCode).toBe(statusCode)
    expect(error.status).toBe('fail')
    expect(error.isOperational).toBe(true)
  })

  it('should set status to "fail" for 4xx status codes', () => {
    const error400 = new AppError('Bad Request', 400)
    const error404 = new AppError('Not Found', 404)
    const error422 = new AppError('Unprocessable Entity', 422)
    
    expect(error400.status).toBe('fail')
    expect(error404.status).toBe('fail')
    expect(error422.status).toBe('fail')
  })

  it('should set status to "error" for 5xx status codes', () => {
    const error500 = new AppError('Internal Server Error', 500)
    const error502 = new AppError('Bad Gateway', 502)
    const error503 = new AppError('Service Unavailable', 503)
    
    expect(error500.status).toBe('error')
    expect(error502.status).toBe('error')
    expect(error503.status).toBe('error')
  })

  it('should set status to "error" for 3xx status codes', () => {
    const error300 = new AppError('Multiple Choices', 300)
    const error301 = new AppError('Moved Permanently', 301)
    const error302 = new AppError('Found', 302)
    
    expect(error300.status).toBe('error')
    expect(error301.status).toBe('error')
    expect(error302.status).toBe('error')
  })

  it('should set status to "error" for 2xx status codes', () => {
    const error200 = new AppError('OK', 200)
    const error201 = new AppError('Created', 201)
    const error204 = new AppError('No Content', 204)
    
    expect(error200.status).toBe('error')
    expect(error201.status).toBe('error')
    expect(error204.status).toBe('error')
  })

  it('should set status to "error" for 1xx status codes', () => {
    const error100 = new AppError('Continue', 100)
    const error101 = new AppError('Switching Protocols', 101)
    
    expect(error100.status).toBe('error')
    expect(error101.status).toBe('error')
  })

  it('should set isOperational to true', () => {
    const error = new AppError('Test error', 500)
    
    expect(error.isOperational).toBe(true)
  })

  it('should capture stack trace', () => {
    const error = new AppError('Test error', 500)
    
    expect(error.stack).toBeDefined()
    expect(typeof error.stack).toBe('string')
  })

  it('should be an instance of Error', () => {
    const error = new AppError('Test error', 400)
    
    expect(error).toBeInstanceOf(Error)
    expect(error).toBeInstanceOf(AppError)
  })

  it('should handle edge case status codes', () => {
    const error0 = new AppError('Zero status', 0)
    const error999 = new AppError('High status', 999)
    
    expect(error0.status).toBe('error')
    expect(error999.status).toBe('error')
  })

  it('should handle string status codes', () => {
    const error = new AppError('Test error', '400')
    
    expect(error.statusCode).toBe('400')
    expect(error.status).toBe('fail')
  })

  it('should handle negative status codes', () => {
    const error = new AppError('Test error', -1)
    
    expect(error.statusCode).toBe(-1)
    expect(error.status).toBe('error')
  })
})
