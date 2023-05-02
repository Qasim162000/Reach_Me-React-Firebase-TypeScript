import React, { useContext, useState, useEffect } from "react";
import Image from "next/image";
import { useAuthState } from "react-firebase-hooks/auth";
import EventsContext from "./context/events/EventsContext";
import { auth } from "../firebase/firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { firestore } from "../firebase/firebase";

const SUPER_ADMIN_EMAIL = "superadmin@example.com";

interface EventItemProps {
  image: string;
  title: string;
  organizers: string;
  place: string;
  description: string;
  date: string;
  time: string;
  id: string;
  onDelete?: (id: string) => Promise<void>;
}

const EventItem: React.FC<EventItemProps> = ({
  id,
  image,
  title,
  organizers,
  place,
  description,
  date,
  time,
}) => {
  const { event, setEvent, deleteEvent } = useContext(EventsContext);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (user && user.email === SUPER_ADMIN_EMAIL) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  const handleDelete = async () => {
    await deleteDoc(doc(firestore, "events", id));
    const updatedEvents = event.filter((event) => event.id !== id);
    setEvent(updatedEvents);
  };

  return (
    <div className="flex flex-col xl:mx-4 mx-2 my-4">
      <div className="flex flex-col justify-between bg-white rounded-lg shadow-xl border-t-8 border-indigo-700">
        <Image src={image} alt={title} width="800" height="500" />
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-gray-700 text-base mb-2">{description}</p>
          <div className="flex justify-between items-center">
            <p className="text-gray-600 text-base">
              <span className="font-bold">Organizers:</span> {organizers}
            </p>
            <p className="text-gray-600 text-base">
              <span className="font-bold">Place:</span> {place}
            </p>
          </div>
          <div className="flex justify-between items-center mt-2">
            <p className="text-gray-600 text-base">
              <span className="font-bold">Date:</span> {date}
            </p>
            <p className="text-gray-600 text-base">
              <span className="font-bold">Time:</span> {time}
            </p>
          </div>
          {isAdmin && (
            <div className="flex justify-end">
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-2"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventItem;
