import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/modules/product/model';
import { ProductService } from 'src/app/modules/product/services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: [
  ]
})
export class HomeComponent implements OnInit{
  products: any[] = [];

  images: string[] = [
    'assets/images/image.png',
    'assets/images/bb.png',
    'assets/images/logo.png',
  ];
  currentIndex = 0;

  currentImageIndex = 0; 
  constructor(
    private _productService:ProductService,
    private router: Router
  ){
  }
  ngOnInit(): void {
    this.loadProducts();
  }
  loadProducts(): void {
    this._productService.getAllProduct().subscribe({
        next: (data) => {
            this.products = data;
            console.log('Products loaded:', this.products);
        },
        error: (error) => {
            console.error('There was an error loading the products!', error);
        }
    });
}


  prevSlide() {
    this.currentIndex = (this.currentIndex > 0) ? this.currentIndex - 1 : this.images.length - 1;
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex < this.images.length - 1) ? this.currentIndex + 1 : 0;
  }


  goToProductDetails(product: any) {
    this.router.navigate(['/product', { product: JSON.stringify(product) }]);
    console.log("product",product);
    
  }

}
