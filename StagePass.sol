// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract StagePass {

    struct Event {
        string name;
        uint256 ticketPrice;
        uint256 totalTickets;
        uint256 ticketsSold;
    }

    struct Ticket {
        uint256 eventId;
        address owner;
        bool exists;
    }

    uint256 public eventCount;
    uint256 public ticketCount;

    mapping(uint256 => Event) public events;
    mapping(uint256 => Ticket) public tickets;

    event EventCreated(uint256 eventId, string name);
    event TicketBooked(uint256 ticketId, uint256 eventId, address owner);

    function createEvent(
        string memory _name,
        uint256 _ticketPrice,
        uint256 _totalTickets
    ) public {
        require(_ticketPrice > 0, "Price must be greater than zero");
        require(_totalTickets > 0, "Tickets must be greater than zero");

        eventCount++;

        events[eventCount] = Event(
            _name,
            _ticketPrice,
            _totalTickets,
            0
        );

        emit EventCreated(eventCount, _name);
    }

    function bookTicket(uint256 _eventId) public payable {
        Event storage selectedEvent = events[_eventId];

        require(_eventId > 0 && _eventId <= eventCount, "Invalid event");
        require(
            selectedEvent.ticketsSold < selectedEvent.totalTickets,
            "Sold out"
        );
        require(msg.value == selectedEvent.ticketPrice, "Incorrect payment");

        ticketCount++;
        selectedEvent.ticketsSold++;

        tickets[ticketCount] = Ticket(
            _eventId,
            msg.sender,
            true
        );

        emit TicketBooked(ticketCount, _eventId, msg.sender);
    }

    function getEvent(uint256 _eventId)
        public
        view
        returns (string memory, uint256, uint256, uint256)
    {
        Event memory selectedEvent = events[_eventId];

        return (
            selectedEvent.name,
            selectedEvent.ticketPrice,
            selectedEvent.totalTickets,
            selectedEvent.ticketsSold
        );
    }
}
