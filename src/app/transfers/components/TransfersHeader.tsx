'use client';

import React from 'react';
import { Plus, Download, Upload } from 'lucide-react';

interface Props {
  onInitiateTransfer: () => void;
}

export default function TransfersHeader({ onInitiateTransfer }: Props) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-600 text-white">Transfers</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Initiate, approve, and track payment transfers
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-elevated border border-border text-sm text-muted-foreground hover:text-white transition-all duration-150">
          <Upload size={13} />
          <span>Import</span>
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-elevated border border-border text-sm text-muted-foreground hover:text-white transition-all duration-150">
          <Download size={13} />
          <span>Export</span>
        </button>
        <button
          onClick={onInitiateTransfer}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-primary text-white text-sm font-500 hover:bg-primary/90 active:scale-95 transition-all duration-150"
        >
          <Plus size={14} />
          <span>Initiate Transfer</span>
        </button>
      </div>
    </div>
  );
}
