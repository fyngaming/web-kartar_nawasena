import React, { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { MemberData } from '../../../types';

const MONTHS = [
  'All', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export const BendaharaTab: React.FC = () => {
  const { members, transactions, addTransaction, siteSettings } = useApp();
  const [selectedMember, setSelectedMember] = useState<string | null>(members[0]?.id || null);
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'Setoran' | 'Pengeluaran'>('Setoran');
  const [note, setNote] = useState('');
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [fromMonth, setFromMonth] = useState<number>(0); // 0 = all
  const [toMonth, setToMonth] = useState<number>(0);

  const balances = useMemo<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    members.forEach(m => map[m.id] = 0);
    (transactions || []).forEach(tx => {
      const amount = typeof tx.amount === 'number' ? tx.amount : Number(tx.amount || 0);
      map[tx.memberId] = (map[tx.memberId] || 0) + (amount as number);
    });
    return map;
  }, [members, transactions]);

  const filteredTransactions = useMemo(() => {
    if (!transactions) return [];
    return transactions.filter(tx => {
      const d = new Date(tx.createdAt);
      if (d.getFullYear() !== year) return false;
      if (fromMonth > 0 && d.getMonth() + 1 < fromMonth) return false;
      if (toMonth > 0 && d.getMonth() + 1 > toMonth) return false;
      return true;
    }).sort((a, b) => (new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  }, [transactions, year, fromMonth, toMonth]);

  const totalBalance = Object.values(balances).reduce<number>((s, v) => s + (v as number), 0);

  const submit = () => {
    if (!selectedMember || !amount) return;
    const val = Number(amount);
    if (isNaN(val)) return;
    const signed = type === 'Setoran' ? Math.abs(val) : -Math.abs(val);
    addTransaction({ memberId: selectedMember, amount: signed, type: type === 'Setoran' ? 'Setoran' : 'Pengeluaran', note });
    setAmount(''); setNote('');
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10">
        <h2 className="text-xl font-extrabold text-white">Bendahara — Kas Anggota</h2>
        <p className="text-xs text-slate-300 mt-1">Halaman input kas per anggota dan ringkasan saldo.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white">Daftar Anggota & Saldo</h3>
              <div className="flex items-center gap-2 text-xs">
                <select value={year} onChange={e => setYear(Number(e.target.value))} className="p-2 rounded bg-slate-800 text-white">
                  {Array.from({length: 5}).map((_,i) => {
                    const y = new Date().getFullYear() - i;
                    return <option key={y} value={y}>{y}</option>;
                  })}
                </select>
                <select value={fromMonth} onChange={e => setFromMonth(Number(e.target.value))} className="p-2 rounded bg-slate-800 text-white">
                  {MONTHS.map((m, idx) => <option key={m} value={idx}>{m}</option>)}
                </select>
                <select value={toMonth} onChange={e => setToMonth(Number(e.target.value))} className="p-2 rounded bg-slate-800 text-white">
                  {MONTHS.map((m, idx) => <option key={m} value={idx}>{m}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {members.map(m => {
                const txs = filteredTransactions.filter(tx => tx.memberId === m.id && tx.type === 'Setoran');
                const payCount = txs.length;
                const expected = siteSettings?.expectedPaymentsPerYear || 12;
                const percent = expected > 0 ? Math.min(100, Math.round((payCount / expected) * 100)) : 0;
                return (
                <div key={m.id} className="p-3 rounded-xl bg-white/3 border border-white/5 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-300">{m.fullName}</div>
                    <div className="font-mono text-[11px] text-amber-300">{m.id}</div>
                  </div>
                  <div className="text-right w-40">
                    <div className="text-sm font-bold text-white">Rp { (balances[m.id] || 0).toLocaleString() }</div>
                    <div className="text-[11px] text-slate-400">{m.status} • {payCount}x ({percent}%)</div>
                    <div className="mt-2 h-2 bg-white/5 rounded-full overflow-hidden">
                      <div style={{ width: `${percent}%` }} className={`h-2 bg-emerald-400`} />
                    </div>
                  </div>
                </div>
              )})}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white mb-2">Riwayat Transaksi (filter aktif)</h3>
              <div>
                <button onClick={() => {
                  // export filteredTransactions as CSV
                  const rows = filteredTransactions.map(tx => ({
                    id: tx.id,
                    memberId: tx.memberId,
                    memberName: members.find(m => m.id === tx.memberId)?.fullName || '',
                    amount: tx.amount,
                    type: tx.type,
                    note: tx.note || '',
                    createdAt: tx.createdAt
                  }));
                  if (rows.length === 0) { alert('Tidak ada transaksi untuk diekspor.'); return; }
                  const header = Object.keys(rows[0]);
                  const csv = [header.join(',')].concat(rows.map(r => header.map(h => `"${String((r as any)[h] || '').replace(/"/g,'""')}"`).join(','))).join('\n');
                  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `transactions_${year}_${fromMonth}-${toMonth}.csv`;
                  a.click();
                  URL.revokeObjectURL(url);
                }} className="px-3 py-1 rounded bg-slate-700 text-xs">Export CSV</button>
              </div>
            </div>
            <div className="text-xs text-slate-300">
              {filteredTransactions.slice(0, 200).map(tx => (
                <div key={tx.id} className="flex items-center justify-between py-2 border-b border-white/5">
                  <div>
                    <div className="font-semibold text-white">{members.find(m => m.id === tx.memberId)?.fullName || tx.memberId}</div>
                    <div className="text-[11px] text-slate-400">{tx.type} • {tx.note || '-'} • {new Date(tx.createdAt).toLocaleString()}</div>
                  </div>
                  <div className={`font-mono text-sm ${tx.amount >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>Rp {tx.amount.toLocaleString()}</div>
                </div>
              ))}
              {(filteredTransactions || filteredTransactions.length === 0) && <div className="text-slate-500 text-sm py-6">Belum ada transaksi untuk filter ini.</div>}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="text-sm font-bold text-white mb-3">Input Transaksi</h3>
            <div className="space-y-2 text-xs">
              <label className="block">Pilih Anggota</label>
              <select value={selectedMember || ''} onChange={e => setSelectedMember(e.target.value)} className="w-full p-2 rounded-xl bg-slate-800 text-white text-xs">
                {members.map(m => <option key={m.id} value={m.id}>{m.fullName} — {m.id}</option>)}
              </select>

              <label className="block">Tipe</label>
              <select value={type} onChange={e => setType(e.target.value as any)} className="w-full p-2 rounded-xl bg-slate-800 text-white text-xs">
                <option value="Setoran">Setoran</option>
                <option value="Pengeluaran">Pengeluaran</option>
              </select>

              <label className="block">Jumlah (Rp)</label>
              <input value={amount} onChange={e => setAmount(e.target.value)} className="w-full p-2 rounded-xl bg-slate-800 text-white text-xs" />

              <label className="block">Catatan</label>
              <input value={note} onChange={e => setNote(e.target.value)} className="w-full p-2 rounded-xl bg-slate-800 text-white text-xs" />

              <button onClick={submit} className="w-full mt-2 px-3 py-2 rounded-xl bg-emerald-500 text-slate-900 font-bold">Simpan Transaksi</button>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="text-sm font-bold text-white">Ringkasan Kas</h3>
            <div className="text-xl font-extrabold text-amber-300 mt-3">Rp {totalBalance.toLocaleString()}</div>
            <div className="text-[11px] text-slate-400 mt-1">Total saldo keseluruhan (semua anggota)</div>
            <div className="mt-4 text-sm text-slate-300">
              <div>Rata-rata kepatuhan bayar: {(() => {
                const arr = members.map(m => {
                  const count = filteredTransactions.filter(tx => tx.memberId === m.id && tx.type === 'Setoran').length;
                  return Math.min(100, Math.round((count / 12) * 100));
                });
                if (arr.length === 0) return '0%';
                const avg = Math.round(arr.reduce((s, v) => s + v, 0) / arr.length);
                return `${avg}%`;
              })()}</div>
              <div>Jumlah anggota bayar penuh (12x): {members.filter(m => filteredTransactions.filter(tx => tx.memberId === m.id && tx.type === 'Setoran').length >= 12).length}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
