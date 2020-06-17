import { Component, OnInit } from '@angular/core';
// import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
// import { Observable } from 'rxjs';
// import {Itemm} from '../models/item';

// export interface Item { id: string; name: string;start: string;end: string;price: string;status: string; }


// @Component({
//   selector: 'app-main',
//   templateUrl: './main.component.html',
//   styleUrls: ['./main.component.css']
// })
// export class MainComponent implements OnInit {
//   private itemsCollection: AngularFirestoreCollection<Item>;
//   item: Observable<Item[]>;
//   title = 'TourManagement';
//   constructor(private readonly afs: AngularFirestore) {
//     this.itemsCollection = afs.collection<Item>('item');
//    //this.items = this.itemsCollection.valueChanges();
        
//         // .valueChanges() is simple. It just returns the 
//         // JSON data without metadata. If you need the 
//         // doc.id() in the value you must persist it your self
//         // or use .snapshotChanges() instead. Only using for versions 7 and earlier
// this.item = this.itemsCollection.valueChanges( { idField: 'id' });
//   }

//   ngOnInit(): void {
//   }

// }


//  import { Component } from '@angular/core';


//  import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
//  import { Observable } from 'rxjs';


//  export interface Item { id: string; name: string;start: string;end: string;price: string;status: string; }



// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.css']
// })
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Itemm } from '../models/item';
import { ItemService } from '../services/item.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  public item$: Observable<Itemm[]>;
  private image:any;
  constructor(private postSvc: ItemService) { }

  public newPostForm = new FormGroup({
    id: new FormControl('', Validators.required),
    image: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    start: new FormControl('', Validators.required),
    end: new FormControl('', Validators.required),
    price: new FormControl('', Validators.required),
    status: new FormControl('', Validators.required),
  })

  ngOnInit(): void {
    this.item$ = this.postSvc.getAllPosts();
  }

  addNewPost(data: Itemm){
    console.log('New post', data);
    this.postSvc.preAddAndUpdatePost(data,this.image);
  }

  handleImage(event:any): void{
    this.image = event.target.files[0]
  }
}
