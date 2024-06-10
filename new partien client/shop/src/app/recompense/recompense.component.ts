import { Component, OnInit } from '@angular/core';
import { ProductService } from '../modules/product/services/product.service';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth/auth.service';

@Component({
  selector: 'app-recompense',
  templateUrl: './recompense.component.html',
  styleUrls: ['./recompense.component.scss']
})
export class RecompenseComponent implements OnInit {
  products: any[] = [];
  pointUser: number = 0;
  userId: string | null = null;

  constructor(private productService: ProductService, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {

    
    const user = JSON.parse(localStorage.getItem('userconnect')!);
    if (user) {
      this.pointUser = user.points || 0;
      this.userId = user.id;
      console.log("User points:", this.pointUser);
    }

    this.productService.getAllProducts().subscribe(
      (data) => {
        this.products = data;
        console.log("Products:", this.products);
      },
      (error) => {
        console.error('Error fetching products', error);
      }
    );
  }

  getImageUrl(imagePath: string): string {
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    return `http://localhost:3000/uploads/${imagePath}`;
  }

  // acheter(product: any): void {
  //   console.log("Attempting to purchase product:", product);
  //   console.log("User points:", this.pointUser);
  //   console.log("Product points:", product.point);
  //   console.log("user id:", this.userId);
  
  //   if (this.userId && product.point <= this.pointUser) {
  //     const newPoints = this.pointUser - product.point;
  //     console.log("New user points after purchase:", newPoints); // New debug statement
  //     this.authService.updateUserPoints(this.userId, newPoints).subscribe(
  //       (response: any) => {
  //         console.log('Product purchased:', product);
  //         // Update local storage and component state
  //         this.pointUser = newPoints;
  //         const user = JSON.parse(localStorage.getItem('userconnect')!);
  //         user.points = newPoints;
  //         localStorage.setItem('userconnect', JSON.stringify(user));
  //         localStorage.setItem('point', JSON.stringify(user.points));
  //         alert('Achat successful!');
  //         window.location.reload(); // Reload the page after successful purchase

  //       },
  //       (error) => {
  //         console.error('Error updating points', error);
  //         alert('An error occurred during the purchase. Please try again.');
  //       }
  //     );
  //   } else {
  //     alert('Not enough points to purchase this product');
  //     console.log('Not enough points to purchase this product');
  //   }
  // }
  


  acheter(product: any): void {
    console.log("Attempting to purchase product:", product);
    console.log("User points:", this.pointUser);
    console.log("Product points:", product.point);
    console.log("User ID:", this.userId);
    
    // Ensure userId is a string
    if (!this.userId || typeof this.userId !== 'string') {
      alert('User ID is invalid.');
      return;
    }
  
    if (product.point > this.pointUser) {
      alert('Not enough points to purchase this product');
      console.log('Not enough points to purchase this product');
      return;
    }
  
    const newPoints = this.pointUser - product.point;
    console.log("New user points after purchase:", newPoints); // New debug statement
  
    // Add purchased product to the database
    const recompenseData = {
      card: product._id,
      user: this.userId
    };
  
    this.authService.addRecompense(recompenseData).subscribe(
      (recompenseResponse: any) => {
        console.log('Recompense added to database:', recompenseResponse);
  
        // Update local storage and component state
        this.pointUser = newPoints;
        const user = JSON.parse(localStorage.getItem('userconnect')!);
        user.points = newPoints;
        localStorage.setItem('userconnect', JSON.stringify(user));
        localStorage.setItem('point', JSON.stringify(user.points));
        alert('Purchase successful!');
  
        // Now update user points
        this.authService.updateUserPoints(this.userId, newPoints).subscribe(
          (response: any) => {
            console.log('User points updated:', response);
            // Optionally, perform any additional actions after updating user points
            window.location.reload(); // Reload the page after successful purchase

          },
          (error) => {
            console.error('Error updating points', error);
            // Handle error if necessary
          }
        );
      },
      (recompenseError) => {
        console.error('Error adding recompense to database', recompenseError);
        alert('An error occurred while adding the recompense to the database. Please try again.');
      }
    );
  }
  
  
  




}
