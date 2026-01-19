import css from "./App.module.css";
import { useState } from "react";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import fetchNotes  from "../../services/noteService";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";
import { useDebounce } from "use-debounce";
import NoteList from "../NoteList/NoteList";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";

function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debounceSearchQuery] = useDebounce(searchQuery, 500);

  const { data } = useQuery({
    queryKey: ["notes", debounceSearchQuery, currentPage],
    queryFn: () => fetchNotes(debounceSearchQuery, currentPage),
    placeholderData: keepPreviousData,
  });


  const handleChange = (newQuery: string) => {
    setSearchQuery(newQuery);
    setCurrentPage(1);
  };

  const notes = data?.notes ?? [];
  const totalPages = data?.totalCount ? Math.ceil(data.totalCount / 10) : 0;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateNote, setIsCreateNote] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const toggleCreate = () => {
    setIsCreateNote(!isCreateNote);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onSearch={handleChange} />
        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}
        <button
          onClick={() => {
            toggleModal();
            toggleCreate();
          }}
          className={css.button}
        >
          Create note +
        </button>



      </header>

 {isModalOpen &&  <Modal onClose={toggleModal}>
  {isCreateNote && <NoteForm onClose={() => {
                toggleModal();
                toggleCreate();
              }} /> }
   </Modal>}


      {notes.length > 0 && <NoteList notes={notes} />}
    </div>
  );
}

export default App;
