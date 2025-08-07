const BASE_URL = '/api/notes'; // TODO: Replace with your backend endpoint if it's different

// PUBLIC_INTERFACE
export async function listNotes() {
    /** Get all notes. Returns array of {id, title, content, updated_at}. */
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error('Failed to load notes');
    return await res.json();
}

// PUBLIC_INTERFACE
export async function getNote(id: string | number) {
    /** Get note by id. Returns {id, title, content, updated_at}. */
    const res = await fetch(`${BASE_URL}/${id}`);
    if (!res.ok) throw new Error('Note not found');
    return await res.json();
}

// PUBLIC_INTERFACE
export async function createNote(note: {title: string, content: string}) {
    /** Create a note. Returns new note. */
    const res = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(note),
    });
    if (!res.ok) throw new Error('Failed to create note');
    return await res.json();
}

// PUBLIC_INTERFACE
export async function updateNote(id: string | number, note: {title: string, content: string}) {
    /** Update a note. Returns updated note. */
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(note),
    });
    if (!res.ok) throw new Error('Failed to update note');
    return await res.json();
}

// PUBLIC_INTERFACE
export async function deleteNote(id: string | number) {
    /** Delete a note. Returns {success: true} */
    const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete note');
    return await res.json();
}
