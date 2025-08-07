import React, { useState } from 'react';
import NoteList from './NoteList';
import NoteDetails from './NoteDetails';

export default function NotesApp() {
  const [selectedId, setSelectedId] = useState<string|null>(null);
  const [refresh, setRefresh] = useState<boolean>(false);

  function handleSelect(id: string) {
    setSelectedId(id);
  }
  function handleCreate() {
    setSelectedId('__new');
  }
  function handleDelete() {
    setSelectedId(null);
    setRefresh(true);
  }
  function handleCreated(id: string) {
    setSelectedId(id);
    setRefresh(true);
  }
  function handleUpdated() {
    setRefresh(true);
  }

  return (
    <>
      <NoteList
        selectedId={selectedId}
        onSelect={handleSelect}
        onCreate={handleCreate}
        refresh={refresh}
        setRefresh={setRefresh}
      />
      <NoteDetails
        noteId={selectedId}
        onCreated={handleCreated}
        onDeleted={handleDelete}
        onUpdated={handleUpdated}
      />
    </>
  );
}
