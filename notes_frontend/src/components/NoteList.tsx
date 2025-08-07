import React, { useEffect, useState } from 'react';
import { listNotes } from '../utils/api';

interface Note {
    id: string;
    title: string;
    updated_at: string;
}

type NoteListProps = {
    selectedId: string | null;
    onSelect: (id: string) => void;
    onCreate: () => void;
    refresh: boolean;
    setRefresh: (r: boolean) => void;
};

export default function NoteList({selectedId, onSelect, onCreate, refresh, setRefresh}: NoteListProps) {
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        listNotes()
            .then(notes => setNotes(notes.sort(
                (a:Note, b:Note) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())))
            .catch((e) => setError(e.message))
            .finally(() => {
                setLoading(false);
                setRefresh(false);
            });
    }, [refresh, setRefresh]);

    return (
        <div className="notes-list">
            <div style={{display: 'flex', justifyContent:'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span className="notes-list-header">Notes</span>
                <button onClick={onCreate} title="Create Note"
                    style={{
                        background: 'var(--color-primary)',
                        border: 'none', color: '#fff',
                        borderRadius: 'var(--radius)',
                        fontWeight: 500, padding: '0.38em 1.1em',
                        fontSize: '1em', cursor: 'pointer'
                    }}>+ New</button>
            </div>
            {loading ? <div>Loading...</div> : error ? <div style={{color:'var(--color-accent)'}}>Failed: {error}</div> : (
                <div>
                    {notes.length === 0 && <div style={{color:'var(--color-text-muted)',marginTop:'1em'}}>No notes found.</div>}
                    {notes.map(note => (
                        <div key={note.id}
                             className={'note-item' + (note.id === selectedId ? ' selected' : '')}
                             onClick={() => onSelect(note.id)}>
                            <div style={{flex:1}}>
                                <div className="note-title">{note.title || <em>(Untitled)</em>}</div>
                                <div className="note-date">{(new Date(note.updated_at)).toLocaleString(undefined,{dateStyle:'medium',timeStyle:'short'})}</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
