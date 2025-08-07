import React, { useEffect, useRef, useState } from 'react';
import { getNote, updateNote, deleteNote, createNote } from '../utils/api';

interface Note {
    id?: string;
    title: string;
    content: string;
    updated_at?: string;
}

type NoteDetailsProps = {
    noteId: string | null;
    onCreated: (id:string)=>void;
    onDeleted: ()=>void;
    onUpdated: ()=>void;
};

export default function NoteDetails({noteId, onCreated, onDeleted, onUpdated}: NoteDetailsProps) {
    const [note, setNote] = useState<Note|null>(null);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string|null>(null);
    const [isNew, setIsNew] = useState(false);
    const titleRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (noteId === null) {
            setNote(null);
            setEditing(false);
            setIsNew(false);
            return;
        }
        if (noteId === '__new') {
            setNote({ title: '', content: '' });
            setEditing(true);
            setIsNew(true);
            if (titleRef.current) titleRef.current.focus();
            return;
        }
        setSaving(true);
        getNote(noteId)
            .then(n => { setNote(n); setEditing(false); setIsNew(false); })
            .catch(e => setError('Note not found'))
            .finally(() => setSaving(false));
    }, [noteId]);

    // Autosave (debounce)
    useEffect(() => {
        if (!editing || !note || !note.id || isNew) return;
        const h = setTimeout(() => {
            setSaving(true);
            updateNote(note.id as string, { title: note.title, content: note.content })
                .then(n => { setNote(n); onUpdated(); })
                .catch(() => setError('Save failed'))
                .finally(() => setSaving(false));
        }, 800);
        return () => clearTimeout(h);
        // eslint-disable-next-line
    }, [note?.title, note?.content]);

    const handleInput = (key:string, val:string) => setNote(n => n ? { ...n, [key]: val } : n);

    const handleSave = async () => {
        if (!note) return;
        setSaving(true);
        try {
            if (isNew) {
                // Save new note
                const created = await createNote({title: note.title, content: note.content});
                setNote(created);
                onCreated(created.id);
                setIsNew(false);
                setEditing(false);
            } else {
                const updated = await updateNote(note.id as string, {title: note.title, content: note.content});
                setNote(updated);
                onUpdated();
                setEditing(false);
            }
        } catch (err) {
            setError('Save failed');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!note || isNew || !note.id) { setNote(null); onDeleted(); return; }
        setSaving(true);
        try {
            await deleteNote(note.id as string);
            setNote(null);
            onDeleted();
        } catch (e) {
            setError('Delete failed');
        }
        setSaving(false);
    };

    if (noteId === null) {
        return (
            <section className="details-panel" style={{color:'var(--color-text-muted)', justifyContent: 'center', alignItems:'center', display:'flex'}}>
                <div>
                    <div style={{fontSize:'1.15rem'}}>Select a note to view/edit.</div>
                    <div style={{fontSize:'3rem',textAlign:'center',opacity:.18,marginTop:'1rem'}}>📝</div>
                </div>
            </section>
        );
    }
    if (error) {
        return <section className="details-panel"><div style={{color:'var(--color-accent)', fontWeight:600}}>Error: {error}</div></section>;
    }
    if (!note) {
        return <section className="details-panel"><div>Loading...</div></section>;
    }
    return (
        <section className="details-panel">
            <div className="details-header">
                {editing ? (
                    <input
                        ref={titleRef}
                        className="details-title"
                        value={note.title}
                        onChange={e => handleInput('title', e.target.value)}
                        placeholder="Title"
                        autoFocus
                        style={{fontWeight:600,fontSize:'1.5rem',flex:1}}
                    />
                ) : (
                    <span className="details-title" tabIndex={0} style={{fontWeight:600, fontSize:'1.5rem'}}>{note.title || <span style={{color:'var(--color-text-muted)'}}>(Untitled)</span>}</span>
                )}
                <div className="details-actions">
                    {editing ? (
                        <>
                            <button className="details-action-button" onClick={handleSave} disabled={saving} style={{color:'var(--color-primary)',fontWeight:600}}>
                                Save
                                {saving && <span className="save-indicator">Saving...</span>}
                            </button>
                            <button className="details-action-button" onClick={() => { setEditing(false); }} style={{color:'var(--color-secondary)'}}>Cancel</button>
                        </>
                    ) : (
                        <>
                            <button className="details-action-button" onClick={() => setEditing(true)} style={{color:'var(--color-primary)',fontWeight:500}}>
                                Edit
                            </button>
                            <button className="details-action-button delete" onClick={handleDelete} title="Delete note">
                                Delete
                            </button>
                        </>
                    )}
                </div>
            </div>
            <textarea
                className="details-textarea"
                value={note.content}
                placeholder="Start typing your notes here..."
                onChange={e => {
                    handleInput('content', e.target.value);
                    setEditing(true);
                }}
                disabled={!editing}
                style={{marginBottom:'1rem'}}
            />
            {note.updated_at && (
                <div style={{fontSize:'0.95em', color:'var(--color-text-muted)',marginTop:'1.5em',marginRight:'2px',textAlign:'right'}}>
                    Last updated: {(new Date(note.updated_at)).toLocaleString(undefined,{dateStyle:'medium', timeStyle:'short'})}
                </div>
            )}
        </section>
    );
}
