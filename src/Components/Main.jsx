import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import "./Main.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import {
    getDatabase,
    ref,
    child,
    push,
    update,
    get,
    remove,
} from "firebase/database";

function Main() {
    const [nazwaUzytkownika, setNazwaUzytkownika] = useState("");
    const navigate = useNavigate();
    const [selectedSortOption, setSelectedSortOption] = useState(0);
    const [events, setEvents] = useState([
        // {
        //     start: moment().toDate(),
        //     end: moment().add(1, "days").toDate(),
        //     title: "Twoje wydarzenie!",
        //     startDate: moment().format("YYYY-MM-DD"),
        //     endDate: moment().add(1, "days").format("YYYY-MM-DD"),
        // },
    ]);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setNazwaUzytkownika(user.email);
                writeUserData(user.uid, user.email);

                // downloading events
                const db = getDatabase();
                get(child(ref(db), `users/${auth.currentUser.uid}/events`))
                    .then((snapshot) => {
                        if (snapshot.exists()) {
                            const eventsData = snapshot.val();
                            setEvents(Object.values(eventsData));

                            // alert o wydarzeniu
                            const today = moment().format("YYYY-MM-DD");
                            Object.values(eventsData).forEach((event) => {
                                if (event.startDate === today) {
                                    alert(
                                        `Dzisiaj masz zaplanowane wydarzenie: ${event.title}`
                                    );
                                }
                            });
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                    });
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

    useEffect(() => {
        sortEvents();
    }, [selectedSortOption]);

    const sortEvents = () => {
        const sortedEvents = [...events];

        switch (selectedSortOption) {
            case "1":
                sortedEvents.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case "2":
                sortedEvents.sort((a, b) => b.title.localeCompare(a.title));
                break;
            case "3":
                sortedEvents.sort(
                    (a, b) => new Date(a.start) - new Date(b.start)
                );
                break;
            case "4":
                sortedEvents.sort(
                    (a, b) => new Date(b.start) - new Date(a.start)
                );
                break;
            default:
                break;
        }

        setEvents(sortedEvents);
    };

    const handleSelect = ({ start, end }) => {
        const title = window.prompt("Wpisz nazwe wydarzenia:");
        if (title && auth.currentUser) {
            const db = getDatabase();

            const newEventKey = push(
                child(ref(db), `users/${auth.currentUser.uid}/events`)
            ).key;

            const newEvent = {
                key: newEventKey,
                start,
                end,
                title,
                startDate: moment(start).format("YYYY-MM-DD"),
                endDate: moment(end).format("YYYY-MM-DD"),
            };

            const updates = {};
            updates[`/users/${auth.currentUser.uid}/events/` + newEventKey] =
                newEvent;
            update(ref(db), updates);
            setEvents((prevEvents) => [...prevEvents, newEvent]);
        }
    };

    const handleDelete = (event) => {
        const confirm = window.confirm(
            `Czy na pewno chcesz usunąć wydarzenie: ${event.title}?`
        );
        if (confirm) {
            if (auth.currentUser) {
                const db = getDatabase();
                remove(
                    child(
                        ref(db),
                        `users/${auth.currentUser.uid}/events/` + event.key
                    )
                );

                setEvents((prevEvents) =>
                    prevEvents.filter((e) => e.key !== event.key)
                );
            }
        }
    };

    const handleListItemClick = (event) => {
        handleDelete(event);
    };

    const handleSortChange = (event) => {
        setSelectedSortOption(event.target.value);
    };

    function writeUserData(userId, email) {
        const db = getDatabase();
        update(ref(db, "users/" + userId), {
            email: email,
        });
    }

    return (
        <div>
            <header className="px-4">
                <h1
                    className="my-2"
                    onClick={() => {
                        console.log(events);
                    }}
                >
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
                    value={selectedSortOption}
                    onChange={handleSortChange}
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
                                key={event.key}
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
                    eventPropGetter={() => {
                        let newStyle = {
                            backgroundColor: "rgb(255, 160, 35)",
                            color: "black",
                            border: "none",
                        };
                        return {
                            style: newStyle,
                        };
                    }}
                />
            </div>
        </div>
    );
}

export default Main;
