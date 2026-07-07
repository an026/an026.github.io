"use client";

import React, { useRef, useState } from "react";
import { Button } from "@/components/ds/Button";
import { UserPlaceholderIcon } from "@/components/icons";
import * as api from "@/lib/data";
import { useData } from "@/lib/DataProvider";
import { fieldWrap, grid2, smallInput, textareaBase } from "./formStyles";

export function AboutTab() {
  const { about, refetchAbout } = useData();
  const formRef = useRef<HTMLDivElement | null>(null);
  const photoInputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!about) return null;

  const readForm = (name: string): string => {
    const el = formRef.current?.querySelector<HTMLInputElement | HTMLTextAreaElement>(`[name="${name}"]`);
    return el ? el.value : "";
  };

  const uploadPhoto = async (file: File) => {
    setUploading(true);
    try {
      const url = await api.uploadMedia(file, "about");
      await api.updateAbout({ photo_url: url });
      await refetchAbout();
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = async () => {
    await api.updateAbout({ photo_url: null });
    await refetchAbout();
  };

  const save = async () => {
    setSaving(true);
    try {
      await api.updateAbout({
        bio1: readForm("bio1").trim(),
        bio2: readForm("bio2").trim(),
        currently: readForm("currently").trim(),
        location: readForm("location").trim(),
        email: readForm("email").trim(),
        photo_caption: readForm("photoCaption").trim(),
      });
      await refetchAbout();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div ref={formRef} style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)", maxWidth: 560 }}>
      <label style={fieldWrap}>
        <span className="av-eyebrow">Bio — paragraph 1</span>
        <textarea name="bio1" defaultValue={about.bio1} style={{ ...textareaBase, minHeight: 90 }} />
      </label>
      <label style={fieldWrap}>
        <span className="av-eyebrow">Bio — paragraph 2</span>
        <textarea name="bio2" defaultValue={about.bio2} style={{ ...textareaBase, minHeight: 90 }} />
      </label>
      <div style={grid2}>
        <label style={fieldWrap}>
          <span className="av-eyebrow">Currently</span>
          <input name="currently" defaultValue={about.currently} style={smallInput} />
        </label>
        <label style={fieldWrap}>
          <span className="av-eyebrow">Location</span>
          <input name="location" defaultValue={about.location} style={smallInput} />
        </label>
      </div>
      <label style={fieldWrap}>
        <span className="av-eyebrow">Email</span>
        <input name="email" defaultValue={about.email} style={smallInput} />
      </label>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <span className="av-eyebrow">Photo</span>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
          <div style={{ width: 64, height: 84, borderRadius: 999, overflow: "hidden", background: "var(--surface-sunk)", border: "1px solid var(--border-subtle)", flex: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {about.photo_url ? (
              <img src={about.photo_url} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <UserPlaceholderIcon size={22} style={{ color: "var(--text-faint)" }} />
            )}
          </div>
          <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
            <Button variant="secondary" onClick={() => photoInputRef.current?.click()}>
              {uploading ? "Uploading…" : "Upload photo"}
            </Button>
            {about.photo_url && (
              <Button variant="secondary" onClick={removePhoto}>
                Remove
              </Button>
            )}
          </div>
        </div>
        <input
          ref={photoInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) uploadPhoto(file);
            e.target.value = "";
          }}
        />
      </div>
      <label style={fieldWrap}>
        <span className="av-eyebrow">Photo caption</span>
        <input name="photoCaption" defaultValue={about.photo_caption} style={smallInput} />
      </label>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Button variant="primary" onClick={save} disabled={saving}>
          Save about
        </Button>
        {saved && <span style={{ fontSize: "var(--text-sm)", color: "var(--success-600)" }}>Saved.</span>}
      </div>
    </div>
  );
}
