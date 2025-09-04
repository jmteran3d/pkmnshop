import { ticketService } from "../services/ticket.service.js";

export const TicketsController = {
  createTicket: async (req, res, next) => {
    try {
      const ticket = await ticketService.createTicket(req.user);
      res.status(201).json({ status: "success", payload: ticket });
    } catch (err) {
      next(err);
    }
  },

  getTickets: async (req, res, next) => {
    try {
      const tickets = await ticketService.getTickets();
      res.json({ status: "success", payload: tickets });
    } catch (err) {
      next(err);
    }
  },

  getTicketById: async (req, res, next) => {
    try {
      const ticket = await ticketService.getTicketById(req.params.tid);
      res.json({ status: "success", payload: ticket });
    } catch (err) {
      next(err);
    }
  },
};
