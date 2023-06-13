import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import "./Main.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";

function Main() {
    const [nazwaUzytkownika, setNazwaUzytkownika] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setNazwaUzytkownika(user.email);
            } else {
                navigate("/");
            }
        });
        return unsubscribe;
    }, [navigate]);

    const localizer = momentLocalizer(moment);
    moment.locale("pl", {
        week: {
            dow: 1,
            doy: 1,
        },
    });

    const [events, setEvents] = useState([
        {
            start: moment().toDate(),
            end: moment().add(1, "days").toDate(),
            title: "Twoje wydarzenie!",
        },
    ]);

    const handleSelect = ({ start, end }) => {
        const title = window.prompt("Wpisz nazwe wydarzenia:");
        if (title) {
            const newEvent = {
                start,
                end,
                title,
            };
            setEvents((prevEvents) => [...prevEvents, newEvent]);
        }
    };

    const handleDelete = (event) => {
        const confirm = window.confirm(
            `Czy na pewno chcesz usunąć wydarzenie: ${event.title}?`
        );
        if (confirm) {
            setEvents((prevEvents) =>
                prevEvents.filter((e) => e.title !== event.title)
            );
        }
    };

    const handleListItemClick = (event) => {
        handleDelete(event);
    };

    return (
        <div>
            <header className="px-4">
                <h1 onClick={() => console.log(events)} className="my-2">
                    Kalendarz użytkownika: {nazwaUzytkownika}
                </h1>
                <button className="btn btn-dark" onClick={() => auth.signOut()}>
                    Wyloguj się
                </button>
            </header>
            <section>
                <h1 className="mt-4">Lista twoich wydarzeń:</h1>
                <select
                    className="form-select form-select-sm select"
                    aria-label=".form-select-sm example"
                    defaultValue={0}
                >
                    <option value="0">Sortuj:</option>
                    <option value="1">Alfabetycznie - Rosnąco</option>
                    <option value="2">Alfabetycznie - Malejąco</option>
                    <option value="3">Według daty - Rosnąco</option>
                    <option value="4">Według daty - Malejąco</option>
                </select>
                <ol className="mt-4">
                    {events.map((event) => {
                        const startDate = new Date(event.start);
                        const endDate = new Date(event.end);
                        const duration = Math.ceil(
                            (endDate - startDate) / (1000 * 60 * 60 * 24)
                        );

                        let durationText = "";
                        if (duration === 1) {
                            durationText = "1 dzień";
                        } else {
                            durationText = `${duration} dni`;
                        }

                        return (
                            <li
                                key={event.title}
                                onClick={() => handleListItemClick(event)}
                            >
                                {event.title} <br />
                                {startDate.toLocaleDateString()} -{" "}
                                {endDate.toLocaleDateString()}
                                <br />
                                (Trwa: {durationText})
                            </li>
                        );
                    })}
                </ol>
            </section>
            <div className="calendar">
                <Calendar
                    localizer={localizer}
                    defaultDate={new Date()}
                    defaultView="month"
                    events={events}
                    selectable={true}
                    onSelectSlot={handleSelect}
                    onSelectEvent={handleDelete}
                    messages={{
                        next: "Następny miesiąc",
                        previous: "Poprzedni miesiąc",
                        today: "Dzisiaj",
                        month: "Miesiąc",
                        week: "Tydzień",
                        day: "Dzień",
                        agenda: "Wydarzenia",
                        date: "Data",
                        time: "Czas",
                        event: "Wydarzenie",
                        showMore: (total) => `+ Pokaż więcej (${total})`,
                    }}
                />
            </div>
        </div>
    );
}

export default Main;
