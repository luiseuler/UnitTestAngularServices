import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ProductsService } from './products.service';
import { Product, CreateProductDTO, UpdateProductDTO } from '../models/product.model';
import { environment } from '../../environments/environment';
import { generateManyProducts, generateOneProduct } from './product.mock';


fdescribe('ProductsService', () => {
    let productService: ProductsService; // Service to test
    let httpController: HttpTestingController; // Allow us make a mock to request petition

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule // Necessary for tests wjth HttpClientModule
            ],
            providers: [
                ProductsService // Service to test
            ]
        });
        productService = TestBed.inject(ProductsService); // We inject our service to test
        httpController = TestBed.inject(HttpTestingController); // Now we inject HttpTestingController to make a mock
    });

    it('should be created', () => {
        expect(productService).toBeTruthy();
    });

    describe('Test for getAllSimple', () => {

        it('should return a product list', (doneFn) => {
            // Arrange
            // This simulate the return data from method to call Fake
            const mockData: Product[] = generateManyProducts(2);

            // Act
            // We call method to test andwe suscribe
            productService.getAllSimple()
                .subscribe((data) => {
                    // Now we expect the return data to be equal to mockData (Fake data)
                    expect(data.length).toEqual(mockData.length);
                    expect(data).toEqual(mockData);
                    doneFn();// Specify the end to the function
                });

            // Http config
            const url = `${environment.API_URL}/api/v1/products`; // Url to make a simulation call
            const req = httpController.expectOne(url); // When a petition with the url previously defined just simulate it
            req.flush(mockData); // And return the mockData (Fake data)
            httpController.verify(); // And jus verify
        });

    });

    describe('Test for getAll', () => {

        it('should return a product list', (doneFn) => {
            // Arrange
            // This simulate the return data from method to call Fake
            const mockData: Product[] = generateManyProducts(2);

            // Act
            // We call method to test andwe suscribe
            productService.getAll()
                .subscribe((data) => {
                    // Now we expect the return data to be equal to mockData (Fake data)
                    expect(data.length).toEqual(mockData.length);
                    doneFn();// Specify the end to the function
                });

            // Http config
            const url = `${environment.API_URL}/api/v1/products`; // Url to make a simulation call
            const req = httpController.expectOne(url); // When a petition with the url previously defined just simulate it
            req.flush(mockData); // And return the mockData (Fake data)
            httpController.verify(); // And jus verify
        });

        it('should return product list with taxes', (doneFn) => {
            // Arrange
            const mockData: Product[] = [
                {
                    ...generateOneProduct(),
                    price: 0
                },
                {
                    ...generateOneProduct(),
                    price: -100
                }
            ];

            // Act
            productService.getAll()
                .subscribe((data) => {
                    // Now we expect the return data to be equal to mockData (Fake data)
                    expect(data.length).toEqual(mockData.length);
                    expect(data[0].taxes).toEqual(0);
                    expect(data[1].taxes).toEqual(0);
                    doneFn();// Specify the end to the function
                });

            // Http config
            const url = `${environment.API_URL}/api/v1/products`; // Url to make a simulation call
            const req = httpController.expectOne(url); // When a petition with the url previously defined just simulate it
            req.flush(mockData); // And return the mockData (Fake data)
            httpController.verify(); // And jus verify
        });

        it('should send queryparams whith limit 10 and offset 3', (doneFn) => {
            // Arrange
            // This simulate the return data from method to call Fake
            const mockData: Product[] = generateManyProducts(2);
            const limit = 10;
            const offset = 3;

            // Act
            // We call method to test andwe suscribe
            productService.getAll(limit, offset)
                .subscribe((data) => {
                    // Now we expect the return data to be equal to mockData (Fake data)
                    expect(data.length).toEqual(mockData.length);
                    doneFn();// Specify the end to the function
                });

            // Http config
            const url = `${environment.API_URL}/api/v1/products?limit=${limit}&offset=${offset}`; // Url to make a simulation call
            const req = httpController.expectOne(url); // When a petition with the url previously defined just simulate it
            req.flush(mockData); // And return the mockData (Fake data)
            const params = req.request.params; // Get the parmas from url
            expect(params.get('limit')).toEqual(`${limit}`); // Params from url must contain a param limit and this to be equal to const limit
            expect(params.get('offset')).toEqual(`${offset}`); // Params from url must contain a offset limit and this to be equal to const limit
            httpController.verify(); // And jus verify
        });

    });

    describe('Test for create', () => {

        it('should return a new product', (doneFn) => {
            // Arrange
            const mockData = generateOneProduct();
            const dto: CreateProductDTO = {
                title: 'new',
                price: 100,
                description: 'blaa',
                images: ['img'],
                categoryId: 12
            }
            // Act
            productService.create({ ...dto })
                .subscribe(resp => {
                    // Assert
                    expect(resp).toEqual(mockData); // Expect return data to be equal to mockData (Fake data send by us)
                    doneFn(); // Indicate end to method
                });

            // Http config
            const url = `${environment.API_URL}/api/v1/products`; // Url to make a simulation call
            const req = httpController.expectOne(url); // When a petition with the url previously defined just simulate it
            req.flush(mockData); // And return the mockData (Fake data)
            expect(req.request.body).toEqual(dto); // Expect that information don´t be modified before insert or create
            expect(req.request.method).toEqual('POST'); // Method Request must be post
            httpController.verify(); // And just verify
        });

    });

    describe('Test for update', () => {

        it('should return a update product', (doneFn) => {
            // Arrange
            const mockData: Product = generateOneProduct();
            const dto: UpdateProductDTO = {
                title: 'new Name'
            }
            const productId = '1';
            // Act
            productService.update(productId, { ...dto })
                .subscribe((data) => {
                    // Assert
                    expect(data).toEqual(mockData);
                    doneFn();
                });

            // Http config
            const url = `${environment.API_URL}/api/v1/products/${productId}`; // Url to make a simulation call
            const req = httpController.expectOne(url); // When a petition with the url previously defined just simulate it
            req.flush(mockData); // And return the mockData (Fake data)
            expect(req.request.body).toEqual(dto); // Expect that information don´t be modified before insert or create
            expect(req.request.method).toEqual('PUT'); // Method Request must be post
            httpController.verify(); // And just verify
        });

    });

    describe('Test for delete', () => {

        it('should delete a product', (doneFn) => {
            // Arrange
            const mockData: boolean = true;
            const productId = '1';
            // Act
            productService.delete(productId)
                .subscribe((data) => {
                    // Assert
                    expect(data).toEqual(mockData);
                    doneFn();
                });

            // Http config
            const url = `${environment.API_URL}/api/v1/products/${productId}`; // Url to make a simulation call
            const req = httpController.expectOne(url); // When a petition with the url previously defined just simulate it
            req.flush(mockData); // And return the mockData (Fake data)
            expect(req.request.method).toEqual('DELETE'); // Method Request must be DELETE
            httpController.verify(); // And just verify
        });

    });

});