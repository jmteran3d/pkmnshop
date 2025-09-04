import Ticket from "../dao/models/ticket.model.js";
export default class TicketRepository {
  create(data) { return Ticket.create(data); }
}
