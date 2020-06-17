import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators';
import {Itemm} from '../models/item'
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import {FileI} from '../models/file.interface';
import { AstTransformer } from '@angular/compiler/src/output/output_ast';
import { AngularFireStorage } from '@angular/fire/storage';
@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private postsCollection: AngularFirestoreCollection<Itemm>;

  private filePath: any;
  private downloadURL: Observable<string>;


  // constructor(private http:HttpClient) { }
  // // getItems():Observable <Itemm[]>{
  // //   return this.http.get<Itemm[]>('http://localhost:8000/api/items/');

  //   }

  constructor(
    private afs: AngularFirestore,
    private storage: AngularFireStorage
    ) {
    this.postsCollection = afs.collection<Itemm>('items');
   }
   public getAllPosts(): Observable<Itemm[]> {
    return this.postsCollection
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data() as Itemm;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }


  public getOnePost(id:Itemm): Observable<Itemm>{
    return this.afs.doc<Itemm>(`items/${id}`).valueChanges();
  }




  public deletePostById(item: Itemm){
    return this.postsCollection.doc(item.id).delete();
  }


  public editPostById(item: Itemm, newImage?: FileI){
    if(newImage){
      this.uploadImage(item,newImage);
    }else{
      return this.postsCollection.doc(item.id).update(item);
    }
  }

  public preAddAndUpdatePost(item:Itemm, image: FileI): void{
    this.uploadImage(item,image);
  }

  private savePost(item: Itemm){
    const postObj = {
      id: item.id,
      image:  this.downloadURL,
      fileRef: this.filePath,
      name: item.name,
      start: item.start,
      end: item.end,
      price: item.price,
      status: item.status,

    };
    
    if(item.id){
      return this.postsCollection.doc(item.id).update(postObj);
    }else{
      return this.postsCollection.add(postObj);
    }
  }



   private uploadImage(item: Itemm, image:FileI){
    this.filePath = `images/${image.name}`;
    const fileRef = this.storage.ref(this.filePath);
    const task = this.storage.upload(this.filePath, image);
    task.snapshotChanges()
    .pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe(urlImage => {
          this.downloadURL = urlImage;
          this.savePost(item);
        });
      })
    ).subscribe();
  }

}

