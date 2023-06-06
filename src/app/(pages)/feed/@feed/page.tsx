"use client";

import { eventDetails } from "@/app/types/event";
import IconCard from "./iconCard";
import Events from "@/app/api/events/events";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import CarouselIcon from "@/app/components/carouselIcon";
import IconFlashOutline from "@/app/components/icons/flash";
import Category from "@/app/api/category/category";
import { CategoryType } from "@/app/types/category";
import { SearchContext } from "@/app/components/searchContext";

const Feed = async () => {
  const redirect = useRouter();
  const [events, setEvents] = useState<eventDetails[]>([]);
  const [category, setCategory] = useState<CategoryType[]>();
  const [filter, setFilter] = useState<CategoryType>();
  const [search, setSearch] = useState("");
  const context = useContext(SearchContext);

  const handleEvent = async (idReceived: number) => {
    const { id } = await Events.getEventById(idReceived);

    return redirect.push(`/events/${id}`);
  };

  const handleFilter = async (categoryReceived: CategoryType | undefined) => {
    if ((categoryReceived && filter) && (categoryReceived.id === filter.id && context === search)) {
      setFilter(undefined);

      const body = {
        category: undefined,
        name: context
      }
  
      const response = await Events.filterEventsByNameOrCategory(body)
  
      return setEvents(response);
    }
    setSearch(context)
    setFilter(categoryReceived);

    const body = {
      category: categoryReceived?.id,
      name: context
    }

    const response = await Events.filterEventsByNameOrCategory(body)

    return setEvents(response)
  }

  useEffect(() => {
    const category = Category.getCategory();
    const events = Events.getEvents();

    category
      .then((res) => {
        setCategory(res);
      })
      .catch((err) => {
        console.log(err);
      });

    events
      .then((res) => {
        setEvents(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    handleFilter(filter)
  }, [context])

  return (
    <>
      <div className="mt-4">
        <h1 className="text-white font-extrabold text-md px-1">
          Próximos eventos
        </h1>
        <div className="scrollbar-hide no-scrollbar flex overflow-y-scroll scrollbar-hide">
          {category?.map((c) => (
            <CarouselIcon
              key={c.id}
              category={c}
              filter={filter}
              handleFilter={handleFilter}
              text="Feed"
              icon={<IconFlashOutline className="text-3xl" />}
            />
          ))}
        </div>
      </div>
      <div className="flex-wrap justify-around no-scrollbar scrollbar-hide height pb-aa overflow-scroll flex gap-4 mt-4 mx-auto">
        {!events ? (
          <h1 className="font-extrabold text-white text-2xl mt-4">
            Nenhum Evento...
          </h1>
        ) : (
          events.map((e) => (
            <IconCard key={e.id} event={e} handleEvent={handleEvent} />
          ))
        )}
      </div>
    </>
  );
};

export default Feed;
