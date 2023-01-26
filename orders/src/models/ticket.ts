import mongoose from "mongoose";
import { Order,OrderStatus } from "./order";

interface TicketAttrs {
  title:string,
  price:number,
}
export interface TicketDoc extends mongoose.Document {
    title:string,
    price:number,
    isReserved():Promise<Boolean>;
}
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(TicketAttrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema(
  {
    title: { type: String, require: true },
    price: {
      type: Number,
      require: true,
      min:0
    }
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

ticketSchema.statics.build = (attrs: TicketAttrs) => new Ticket(attrs);
ticketSchema.methods.isReserved = async function(){
    const existingOrder = Order.find({ticket:this,status:{$in:[
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete
    ]}})
    return existingOrder?true:false;
};

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket };
