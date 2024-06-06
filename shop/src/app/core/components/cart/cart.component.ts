import { Component,OnDestroy,OnInit } from '@angular/core';
import { Product } from 'src/app/modules/product/model';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
// import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styles: [
    `
    /* hide scrollbar */
  ::-webkit-scrollbar {
    width: 0px;
  }
  ::-webkit-scrollbar-thumb {
    background: rgba(136, 136, 136, 0.281);
  }
  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
    `
  ]
})
export class CartComponent implements OnInit, OnDestroy{
  cart:Product[]|any=[];
  total!:number;
  gstAmount!:number;
  estimatedTotal!:number;
  gstRate=0.18;
  shippingCost=0;
  subsTotal!:Subscription;
  subsGST!:Subscription;
  subsEstimatedTotal!:Subscription;
  userPoints: number = 0; // Add this line
  discount: number = 0; // Discount amount
  pointsToUse: number = 0; // Points to use for discount
  // formControl: FormGroup;
  // pointsToUseFormControl: FormControl;
  paymentByPoints: boolean = false;
  
  constructor(private cartService:CartService,private router:Router,private authService: AuthService,private formBuilder: FormBuilder)
  {
    // this.formControl = this.formBuilder.group({
    //   pointsToUse: new FormControl('', [Validators.required, Validators.min(40)])
    // });
  }

  ngOnInit(): void {
    console.log("cart", this.cart)
    console.log("discount", this.discount)
    console.log("usepoint", this.pointsToUse)

    this.getCart();
    this.getTotal();
    this.getUserPoints(); // Add this line



  }




  getUserPoints() { // Add this function
    const user = JSON.parse(localStorage.getItem('userconnect')!);
    if (user) {
      this.userPoints = user.points || 0;
      console.log("this point user", this.userPoints);

    }
  }


  getCart(){
    this.cart=this.cartService.getCart;
    console.log("aaaaaaa",this.cart);

  }


  getTotal() {
    this.total = this.cartService.getTotal();
    this.subsTotal = this.cartService.totalAmount.subscribe(
      (data) => (this.total = parseInt(data.toFixed(2)))
    );
    this.subsGST = this.cartService.gstAmount.subscribe(
      (data) => (this.gstAmount = parseInt(data.toFixed(2)))
    );
    this.subsEstimatedTotal = this.cartService.estimatedTotal.subscribe(
      (data) => (this.estimatedTotal = parseInt(data.toFixed(2)))
    );
  }


  // applyDiscount() {
  //   if (this.pointsToUse >= 40 && this.userPoints >= this.pointsToUse) {
  //     this.discount = (this.pointsToUse / 40) * 10;
  //   } else {
  //     this.discount = 0;
  //   }
  //   this.estimatedTotal = this.estimatedTotal - this.discount;
  // }
  // applyDiscount() {
  //   if (this.pointsToUse >= 40 && this.userPoints >= this.pointsToUse) {
  //     this.discount = Math.floor(this.pointsToUse / 40) * 10; // $10 discount for every 40 points
  //   } else {
  //     this.discount = 0;
  //   }
  //   this.estimatedTotal = this.estimatedTotal - this.discount;
  // }
  // onPointsChange(event: any) {
  //   this.pointsToUse = event.target.value;
  //   this.applyDiscount();
  // }

  // onPointsChange() {
  //   // Logic to handle points change
  //   console.log("Points to use changed:", this.pointsToUse);
  //   // if (!this.hasEnoughPointsForProduct()) {
  //   //   alert("You do not have enough points to purchase this product");
  //   // }
  // }
  // hasEnoughPoints(): boolean {
  //   let requiredPoints = 0;
  //   for (let product of this.cart) {

  //     requiredPoints += product.pointProduct; // Assuming each product has a pointCost property
  //   }
  //   return this.userPoints >= requiredPoints;
  // }
  hasEnoughPointsForProduct(): boolean {
    for (let product of this.cart) {
      // If points to use is greater than user points or less than product points required, return false
      if (this.pointsToUse > this.userPoints || this.pointsToUse < product.pointProduct) {
        return false;
      }
    }
    return true; // If all products are valid, return true
  }


  onPointsChange(event: any) {
    this.pointsToUse = event.target.value;
    console.log("zzzzzzz",this.pointsToUse);
    
    this.applyDiscount();
  }

  applyDiscount() {
    this.getTotal(); // Recalculate totals whenever points change
  }
// cart.component.ts
// goToCheckout() {
//   if (this.authService.isLoggedIn()) {
//     // Log values to check
//     console.log("Navigating to checkout with:");
//     console.log("Cart:", this.cart);
//     console.log("Discount:", this.discount);
//     console.log("Points to use:", this.pointsToUse);

//     this.router.navigate(['/checkout'], {
//       queryParams: {
//         cart: JSON.stringify(this.cart),
//         discount: this.discount,
//         pointsToUse: this.pointsToUse
//       }
//     });
//   } else {
//     this.router.navigate(['/login'], { queryParams: { returnUrl: '/checkout' } });
//   }
// }






selectPaymentByPrice() {
  this.paymentByPoints = false;
}

selectPaymentByPoints() {
  console.log("this.userPoints",this.userPoints);
  
  if (localStorage.getItem('state') !== '0') {
    this.router.navigate(['/login'], { queryParams: { returnUrl: '/shopping-cart' } });
    return;
  }
  this.paymentByPoints = true;

}
// goToCheckout() {

//   if (!this.hasEnoughPointsForProduct()) {
//       alert("You do not have enough points to purchase this product");
//       return;
//     }

//   if (this.authService.isLoggedIn()) {
//     // if (this.hasEnoughPointsForProduct()) {
//       // Log values to check
//       console.log("Navigating to checkout with:");
//       console.log("Cart:", this.cart);

//         // Set product prices to 0 if using points
//         for (let product of this.cart) {
//           if (this.pointsToUse >= product.pointProduct) {
//             product.price = 0;
//           }
//         }

//         this.cartService.updateTotals(); // Recalculate totals

//       this.router.navigate(['/checkout'], {
//         queryParams: {
//           cart: JSON.stringify(this.cart)

//         }
//       });
//           console.log("qqqqqqq",this.cart)

//     // } else {
//     //   alert("You do not have enough points to purchase this product");
//     // }
//   } else {
//     this.router.navigate(['/login'], { queryParams: { returnUrl: '/checkout' } });
//   }
// }
// goToCheckout(paymentMethod: string) {
//   if (!this.authService.isLoggedIn()) {
//     this.router.navigate(['/login'], { queryParams: { returnUrl: '/checkout' } });
//     return;
//   }

//   // Update grandTotal and pointsToUse based on paymentMethod
//   if (paymentMethod === 'points') {
//     this.cart.grandTotal = 0; // Set grandTotal to 0
//     this.pointsToUse = this.total; // Use total points for payment
//   } else if (paymentMethod === 'price') {
//     this.pointsToUse = 0; // Set pointsToUse to 0
//     // Optionally, you can add logic to calculate the grandTotal based on other factors
//     // For example:
//     // this.grandTotal = this.total - this.discount + this.shippingCost + this.gstAmount;
//   }

//   // Navigate to checkout with updated parameters
//   this.router.navigate(['/checkout'], {
//     queryParams: {
//       cart: JSON.stringify(this.cart),
//       grandTotal: this.cart.grandTotal,
//       pointsToUse: this.pointsToUse
//     }
//   });
//   console.log("zzzzzzzz",this.cart.grandTotal);
  
// }
goToCheckout(paymentMethod: string) {


    

  // Update grandTotal and pointsToUse based on paymentMethod
  if (paymentMethod === 'points') {
    this.cart.grandTotal = 0; // Set grandTotal to 0
    this.estimatedTotal = 0; // Set estimatedTotal to 0
    this.gstAmount = 0;
    this.pointsToUse = this.pointsToUse; // Use total points for payment
    let totalPointsRequired = 0;

    // Loop through each product in the cart and accumulate their pointProduct values
    for (let product of this.cart) {
      totalPointsRequired +=parseInt(product.pointProduct);
      console.log("totalPointsRequired00..00..",totalPointsRequired);
      console.log("totalPointsRequired00..00..", product.pointProduct);
      console.log("totalPointsRequired00..00..used", this.pointsToUse);
    }
    // for (let product of this.cart) {
    //   totalPointsRequired += product.pointProduct;
     
      
      if (this.pointsToUse > this.userPoints || this.pointsToUse < totalPointsRequired) {
        alert("You do not have enough points to purchase these products");
        return;
      }
    // }
  } else if (paymentMethod === 'price') {
    this.pointsToUse = 0; // Set pointsToUse to 0
    // Optionally, you can add logic to calculate the grandTotal based on other factors
    // For example:
    // this.grandTotal = this.total - this.discount + this.shippingCost + this.gstAmount;

   
  }
  if (!this.authService.isLoggedIn()) {
    this.router.navigate(['/login'], { queryParams: { returnUrl: '/checkout' } });
    return;
  }
  // Navigate to checkout with updated parameters
  this.router.navigate(['/checkout'], {
    queryParams: {
      cart: JSON.stringify(this.cart),
      grandTotal: this.cart.grandTotal,
      pointsToUse: this.pointsToUse
    }
  });
  console.log("pointsToUse in cart",this.pointsToUse);
   // If paymentByPoints is false, update the estimatedTotal
   if (!this.paymentByPoints) {
    this.estimatedTotal = this.total + this.gstAmount;
  }
  
}







  unsubscribeSubject(){
    this.subsTotal.unsubscribe();
    this.subsGST.unsubscribe();
    this.subsEstimatedTotal.unsubscribe();
  }

  ngOnDestroy(): void {
    this.unsubscribeSubject();
  }
}

