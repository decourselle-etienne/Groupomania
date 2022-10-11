
export class Card {

  _id?: string;
  prenom!: string;
  nom!: string
  content!: string;
  imageUrl!: string;
  createdDate!: Date;
  likes!: number;
  usersLiked!: string[];
  userId!: string;
}
