import Ticket from "../dao/models/ticket.model.js";

export default class TicketRepository {
  create(data) {
    return Ticket.create(data);
  }

  getAll() {
    return Ticket.find().populate("itemsPurchased.product").lean();
  }

  getById(id) {
    return Ticket.findById(id).populate("itemsPurchased.product").lean();
  }
}
