import { ValueService } from './value.service';
import { TestBed } from '@angular/core/testing';

describe('ValueService', () => {
  let service: ValueService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ValueService]
    });

    service = TestBed.inject(ValueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Tests' serie to a get method
  describe('Test for getValue', () => {
    it('should return "myValue"', () => {
      expect(service.getValue()).toBe('my value'); 
    });
  });

  // Tests' serie to a set mmethod
  describe('Test for setValue', () => {

    it('should change the value', () => {
      expect(service.getValue()).toBe('my value');
      service.setValue('change');
      expect(service.getValue()).toBe('change');
    });

  });

  // Tests's serie to a method return a promise
  describe('Test for getPromiseValue', () => {

    it('should return "promise value" from promise with then', (doneFn) => {
      service.getPromiseValue()
        .then((value) => {
          expect(value).toBe('promise value');
          doneFn();
        });
    });

    it('should return "promise value" from promise using async', async() => {
      const resp  = await service.getPromiseValue();
      expect(resp).toBe('promise value');
    });

  });

});
