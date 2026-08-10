/**
 * supabaseService.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Semua operasi database + storage untuk Karang Taruna Nawasena.
 *
 * STORAGE BUCKET: "media"
 *   /media/gallery/{filename}
 *   /media/board/{filename}
 *   /media/news/{filename}
 *   /media/programs/{filename}
 *   /media/agenda/{filename}
 *   /media/members/{filename}
 */

import { supabase } from './supabase';
import type {
  NewsItem, ProgramItem, AgendaItem, GalleryItem,
  BoardMember, MemberData, RegistrationData, FeedbackItem,
  FAQItem, MeetingMinutes, SiteSettings, AchievementItem
} from '../types';

const BUCKET = 'media';

// ─── Upload gambar ke Supabase Storage ───────────────────────────────────────

/**
 * Upload base64 atau File ke Supabase Storage.
 * Kembalikan public URL yang bisa langsung dipakai di <img src="...">.
 */
export async function uploadImage(
  data: string | File,
  folder: string,
  filename?: string
): Promise<string> {
  // Jika sudah berupa URL https, tidak perlu upload
  if (typeof data === 'string' && data.startsWith('http')) return data;

  let blob: Blob;
  let ext = 'jpg';

  if (typeof data === 'string' && data.startsWith('data:')) {
    const res = await fetch(data);
    blob = await res.blob();
    ext = blob.type.split('/')[1] || 'jpg';
  } else if (data instanceof File) {
    blob = data;
    ext = data.name.split('.').pop() || 'jpg';
  } else {
    return data; // fallback: kembalikan apa adanya
  }

  const fname = filename || `${Date.now()}.${ext}`;
  const path  = `${folder}/${fname}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, blob, {
    upsert: true,
    contentType: blob.type
  });

  if (error) throw new Error(`Upload gagal: ${error.message}`);

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return urlData.publicUrl;
}

/**
 * Hapus gambar dari storage berdasarkan URL publik.
 */
export async function deleteImage(publicUrl: string): Promise<void> {
  try {
    // Ekstrak path dari URL: https://xxx.supabase.co/storage/v1/object/public/media/gallery/abc.jpg
    const match = publicUrl.match(/\/media\/(.+)$/);
    if (match) {
      await supabase.storage.from(BUCKET).remove([match[1]]);
    }
  } catch { /* abaikan error hapus */ }
}

// ─── Proses upload gambar sebelum simpan ke DB ───────────────────────────────

async function processImage(
  url: string | undefined,
  folder: string
): Promise<string> {
  if (!url) return '';
  if (typeof url === 'string' && url.startsWith('data:')) {
    return uploadImage(url, folder);
  }
  return url || '';
}

// ─── Site Settings ────────────────────────────────────────────────────────────

export async function fetchSiteSettings(): Promise<SiteSettings | null> {
  const { data } = await supabase.from('site_settings').select('*').eq('id', 'main').single();
  if (!data) return null;
  return {
    orgName: data.org_name, subName: data.sub_name, slogan: data.slogan,
    address: data.address, subDistrict: data.sub_district, city: data.city,
    postalCode: data.postal_code, whatsapp: data.whatsapp, email: data.email,
    instagram: data.instagram, facebook: data.facebook, youtube: data.youtube,
    mapsEmbedUrl: data.maps_embed_url, history: data.history, vision: data.vision,
    mission: data.mission || [], values: data.values || [],
    establishedYear: data.established_year
  };
}

export async function saveSiteSettings(s: SiteSettings): Promise<void> {
  await supabase.from('site_settings').upsert({
    id: 'main', org_name: s.orgName, sub_name: s.subName, slogan: s.slogan,
    address: s.address, sub_district: s.subDistrict, city: s.city,
    postal_code: s.postalCode, whatsapp: s.whatsapp, email: s.email,
    instagram: s.instagram, facebook: s.facebook, youtube: s.youtube,
    maps_embed_url: s.mapsEmbedUrl, history: s.history, vision: s.vision,
    mission: s.mission, values: s.values, established_year: s.establishedYear
  });
}

// ─── News ─────────────────────────────────────────────────────────────────────

export async function fetchNews(): Promise<NewsItem[]> {
  const { data } = await supabase.from('news').select('*').order('created_at', { ascending: false });
  return (data || []).map(r => ({
    id: r.id, title: r.title, slug: r.slug, summary: r.summary,
    content: r.content, category: r.category, author: r.author,
    date: r.date, thumbnail: r.thumbnail, status: r.status, views: r.views || 0
  }));
}

export async function addNews(item: Omit<NewsItem, 'id' | 'slug' | 'views'>): Promise<NewsItem> {
  const thumbnail = await processImage(item.thumbnail, 'news');
  const slug = item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const { data, error } = await supabase.from('news').insert({
    title: item.title, slug, summary: item.summary, content: item.content,
    category: item.category, author: item.author, date: item.date,
    thumbnail, status: item.status
  }).select().single();
  if (error) throw error;
  return { ...item, id: data.id, slug, thumbnail, views: 0 };
}

export async function updateNews(id: string, item: Partial<NewsItem>): Promise<void> {
  const thumbnail = item.thumbnail ? await processImage(item.thumbnail, 'news') : undefined;
  await supabase.from('news').update({ ...item, thumbnail }).eq('id', id);
}

export async function deleteNews(id: string): Promise<void> {
  const { data } = await supabase.from('news').select('thumbnail').eq('id', id).single();
  if (data?.thumbnail) await deleteImage(data.thumbnail);
  await supabase.from('news').delete().eq('id', id);
}

// ─── Programs ────────────────────────────────────────────────────────────────

export async function fetchPrograms(): Promise<ProgramItem[]> {
  const { data } = await supabase.from('programs').select('*').order('created_at', { ascending: false });
  return (data || []).map(r => ({
    id: r.id, title: r.title, description: r.description,
    fullDetails: r.full_details, category: r.category,
    status: r.status, target: r.target, budget: r.budget,
    image: r.image, coordinator: r.coordinator
  }));
}

export async function addProgram(item: Omit<ProgramItem, 'id'>): Promise<ProgramItem> {
  const image = await processImage(item.image, 'programs');
  const { data, error } = await supabase.from('programs').insert({
    title: item.title, description: item.description, full_details: item.fullDetails,
    category: item.category, status: item.status, target: item.target,
    budget: item.budget, image, coordinator: item.coordinator
  }).select().single();
  if (error) throw error;
  return { ...item, id: data.id, image };
}

export async function updateProgram(id: string, item: Partial<ProgramItem>): Promise<void> {
  const image = item.image ? await processImage(item.image, 'programs') : undefined;
  await supabase.from('programs').update({
    title: item.title, description: item.description, full_details: item.fullDetails,
    category: item.category, status: item.status, target: item.target,
    budget: item.budget, image, coordinator: item.coordinator
  }).eq('id', id);
}

export async function deleteProgram(id: string): Promise<void> {
  const { data } = await supabase.from('programs').select('image').eq('id', id).single();
  if (data?.image) await deleteImage(data.image);
  await supabase.from('programs').delete().eq('id', id);
}

// ─── Agenda ──────────────────────────────────────────────────────────────────

export async function fetchAgenda(): Promise<AgendaItem[]> {
  const { data } = await supabase.from('agenda').select('*').order('date', { ascending: true });
  return (data || []).map(r => ({
    id: r.id, title: r.title, description: r.description, date: r.date,
    time: r.time, location: r.location, mapsUrl: r.maps_url,
    poster: r.poster || '', images: r.images || [],
    status: r.status, category: r.category
  }));
}

/** Upload semua gambar base64 ke Storage, return array URL */
async function uploadImages(images: string[], folder: string): Promise<string[]> {
  return Promise.all(
    images.map(async (img, idx) => {
      if (!img) return '';
      if (img.startsWith('http')) return img; // sudah URL, skip upload
      return processImage(img, folder);
    })
  );
}

export async function addAgenda(item: Omit<AgendaItem, 'id'>): Promise<AgendaItem> {
  const poster = item.poster ? await processImage(item.poster, 'agenda') : '';
  const images = item.images?.length ? await uploadImages(item.images, 'agenda') : [];
  const { data, error } = await supabase.from('agenda').insert({
    title: item.title, description: item.description, date: item.date || null,
    time: item.time, location: item.location, maps_url: item.mapsUrl,
    poster, images, status: item.status, category: item.category
  }).select().single();
  if (error) throw error;
  return { ...item, id: data.id, poster, images };
}

export async function updateAgenda(id: string, item: Partial<AgendaItem>): Promise<void> {
  const poster = item.poster ? await processImage(item.poster, 'agenda') : undefined;
  const images = item.images?.length ? await uploadImages(item.images, 'agenda') : item.images;
  await supabase.from('agenda').update({
    title: item.title, description: item.description, date: item.date || null,
    time: item.time, location: item.location, maps_url: item.mapsUrl,
    poster, images, status: item.status, category: item.category
  }).eq('id', id);
}

export async function deleteAgenda(id: string): Promise<void> {
  const { data } = await supabase.from('agenda').select('poster').eq('id', id).single();
  if (data?.poster) await deleteImage(data.poster);
  await supabase.from('agenda').delete().eq('id', id);
}

// ─── Gallery ─────────────────────────────────────────────────────────────────

export async function fetchGallery(): Promise<GalleryItem[]> {
  const { data } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
  return (data || []).map(r => ({
    id: r.id, title: r.title, caption: r.caption,
    category: r.category, type: r.type, url: r.url, date: r.date
  }));
}

export async function addGalleryItem(item: Omit<GalleryItem, 'id'>): Promise<GalleryItem> {
  const url = await processImage(item.url, 'gallery');
  const { data, error } = await supabase.from('gallery').insert({
    title: item.title, caption: item.caption, category: item.category,
    type: item.type, url, date: item.date
  }).select().single();
  if (error) throw error;
  return { ...item, id: data.id, url };
}

export async function deleteGalleryItem(id: string): Promise<void> {
  const { data } = await supabase.from('gallery').select('url').eq('id', id).single();
  if (data?.url) await deleteImage(data.url);
  await supabase.from('gallery').delete().eq('id', id);
}

// ─── Board Members ────────────────────────────────────────────────────────────

export async function fetchBoard(): Promise<BoardMember[]> {
  const { data } = await supabase.from('board_members').select('*').order('order', { ascending: true });
  return (data || []).map(r => ({
    id: r.id, name: r.name, position: r.position, period: r.period,
    photo: r.photo, order: r.order, phone: r.phone, email: r.email, instagram: r.instagram
  }));
}

export async function addBoardMember(item: Omit<BoardMember, 'id'>): Promise<BoardMember> {
  const photo = await processImage(item.photo, 'board');
  const { data, error } = await supabase.from('board_members').insert({
    name: item.name, position: item.position, period: item.period,
    photo, order: item.order, phone: item.phone, email: item.email, instagram: item.instagram
  }).select().single();
  if (error) throw error;
  return { ...item, id: data.id, photo };
}

export async function updateBoardMember(id: string, item: Partial<BoardMember>): Promise<void> {
  const photo = item.photo ? await processImage(item.photo, 'board') : undefined;
  await supabase.from('board_members').update({
    name: item.name, position: item.position, period: item.period,
    photo, order: item.order
  }).eq('id', id);
}

export async function deleteBoardMember(id: string): Promise<void> {
  const { data } = await supabase.from('board_members').select('photo').eq('id', id).single();
  if (data?.photo) await deleteImage(data.photo);
  await supabase.from('board_members').delete().eq('id', id);
}

// ─── Members ──────────────────────────────────────────────────────────────────

export async function fetchMembers(): Promise<MemberData[]> {
  const { data } = await supabase.from('members').select('*').order('joined_date', { ascending: false });
  return (data || []).map(r => ({
    id: r.id, registrationId: r.registration_id, fullName: r.full_name,
    gender: r.gender, address: r.address, rtRw: r.rt_rw,
    whatsapp: r.whatsapp, email: r.email, interests: r.interests || [],
    status: r.status, joinedDate: r.joined_date, avatar: r.avatar
  }));
}

export async function addMember(item: Omit<MemberData, 'id'>, customId: string): Promise<void> {
  const avatar = await processImage(item.avatar, 'members');
  await supabase.from('members').insert({
    id: customId, registration_id: item.registrationId, full_name: item.fullName,
    gender: item.gender, address: item.address, rt_rw: item.rtRw,
    whatsapp: item.whatsapp, email: item.email, interests: item.interests,
    status: item.status, joined_date: item.joinedDate, avatar
  });
}

export async function updateMember(id: string, item: Partial<MemberData>): Promise<void> {
  const avatar = item.avatar ? await processImage(item.avatar, 'members') : undefined;
  await supabase.from('members').update({
    full_name: item.fullName, gender: item.gender, address: item.address,
    rt_rw: item.rtRw, whatsapp: item.whatsapp, email: item.email,
    interests: item.interests, status: item.status, avatar
  }).eq('id', id);
}

export async function deleteMember(id: string): Promise<void> {
  await supabase.from('members').delete().eq('id', id);
}

// ─── Registrations ───────────────────────────────────────────────────────────

export async function fetchRegistrations(): Promise<RegistrationData[]> {
  const { data } = await supabase.from('registrations').select('*').order('applied_at', { ascending: false });
  return (data || []).map(r => ({
    id: r.id, fullName: r.full_name, pob: r.pob, dob: r.dob, gender: r.gender,
    address: r.address, rtRw: r.rt_rw, whatsapp: r.whatsapp, email: r.email,
    education: r.education, occupation: r.occupation, interests: r.interests || [],
    motivation: r.motivation, orgExperience: r.org_experience,
    photoUrl: r.photo_url, documentUrl: r.document_url, status: r.status,
    rejectionReason: r.rejection_reason, memberId: r.member_id,
    appliedAt: r.applied_at, processedAt: r.processed_at
  }));
}

// ─── Transactions for Bendahara (keuangan) ──────────────────────────────────
export async function fetchTransactions(): Promise<import('../types').FinancialTransaction[]> {
  const { data } = await supabase.from('transactions').select('*').order('created_at', { ascending: false });
  return (data || []).map((r: any) => ({
    id: r.id, memberId: r.member_id, amount: r.amount, type: r.type,
    note: r.note, createdAt: r.created_at
  }));
}

export async function addTransaction(item: Omit<import('../types').FinancialTransaction, 'id'>): Promise<import('../types').FinancialTransaction> {
  const { data, error } = await supabase.from('transactions').insert({
    member_id: item.memberId, amount: item.amount, type: item.type, note: item.note, created_at: item.createdAt || new Date().toISOString()
  }).select().single();
  if (error) throw error;
  return { id: data.id, memberId: data.member_id, amount: data.amount, type: data.type, note: data.note, createdAt: data.created_at };
}

export async function deleteRegistration(id: string): Promise<void> {
  // fetch registration to check member_id
  const { data } = await supabase.from('registrations').select('member_id').eq('id', id).single();
  if (data?.member_id) {
    // delete member if exists
    await supabase.from('members').delete().eq('id', data.member_id);
  }
  await supabase.from('registrations').delete().eq('id', id);
}

export async function addRegistration(item: RegistrationData): Promise<void> {
  const photo = item.photoUrl ? await processImage(item.photoUrl, 'registrations') : '';
  const document = item.documentUrl ? await processImage(item.documentUrl, 'registrations') : '';
  await supabase.from('registrations').insert({
    id: item.id, full_name: item.fullName, pob: item.pob, dob: item.dob,
    gender: item.gender, address: item.address, rt_rw: item.rtRw,
    whatsapp: item.whatsapp, email: item.email, education: item.education,
    occupation: item.occupation, interests: item.interests, motivation: item.motivation,
    org_experience: item.orgExperience, status: item.status, applied_at: item.appliedAt,
    photo_url: photo || null, document_url: document || null
  });
}

export async function updateRegistration(id: string, updates: Partial<RegistrationData>): Promise<void> {
  await supabase.from('registrations').update({
    status: updates.status, rejection_reason: updates.rejectionReason,
    member_id: updates.memberId, processed_at: updates.processedAt
  }).eq('id', id);
}

// ─── Feedbacks ───────────────────────────────────────────────────────────────

export async function fetchFeedbacks(): Promise<FeedbackItem[]> {
  const { data } = await supabase.from('feedbacks').select('*').order('submitted_at', { ascending: false });
  return (data || []).map(r => ({
    id: r.id, name: r.name, email: r.email, whatsapp: r.whatsapp,
    category: r.category, message: r.message, status: r.status,
    replyText: r.reply_text, repliedAt: r.replied_at, submittedAt: r.submitted_at
  }));
}

export async function addFeedback(item: Omit<FeedbackItem, 'id' | 'status' | 'submittedAt'>): Promise<FeedbackItem> {
  const { data, error } = await supabase.from('feedbacks').insert({
    name: item.name, email: item.email, whatsapp: item.whatsapp,
    category: item.category, message: item.message, status: 'Belum Dibaca'
  }).select().single();
  if (error) throw error;
  return { ...item, id: data.id, status: 'Belum Dibaca', submittedAt: data.submitted_at };
}

export async function replyFeedback(id: string, replyText: string): Promise<void> {
  await supabase.from('feedbacks').update({
    status: 'Dibalas', reply_text: replyText, replied_at: new Date().toISOString()
  }).eq('id', id);
}

export async function deleteFeedback(id: string): Promise<void> {
  await supabase.from('feedbacks').delete().eq('id', id);
}

// ─── FAQs ─────────────────────────────────────────────────────────────────────

export async function fetchFAQs(): Promise<FAQItem[]> {
  const { data } = await supabase.from('faqs').select('*').order('created_at', { ascending: true });
  return (data || []).map(r => ({ id: r.id, question: r.question, answer: r.answer, category: r.category }));
}

export async function addFAQ(item: Omit<FAQItem, 'id'>): Promise<FAQItem> {
  const { data, error } = await supabase.from('faqs').insert(item).select().single();
  if (error) throw error;
  return { ...item, id: data.id };
}

export async function updateFAQ(id: string, item: Partial<FAQItem>): Promise<void> {
  await supabase.from('faqs').update(item).eq('id', id);
}

export async function deleteFAQ(id: string): Promise<void> {
  await supabase.from('faqs').delete().eq('id', id);
}

// ─── Meeting Minutes ──────────────────────────────────────────────────────────

export async function fetchMeetingMinutes(): Promise<MeetingMinutes[]> {
  const { data } = await supabase.from('meeting_minutes').select('*').order('created_at', { ascending: false });
  return (data || []).map(r => ({
    id: r.id, meetingNumber: r.meeting_number, title: r.title, type: r.type,
    date: r.date, startTime: r.start_time, endTime: r.end_time, location: r.location,
    facilitator: r.facilitator, secretary: r.secretary, attendees: r.attendees,
    absentees: r.absentees, quorum: r.quorum, openingNotes: r.opening_notes,
    agendaPoints: r.agenda_points || [], closingNotes: r.closing_notes,
    nextMeetingDate: r.next_meeting_date, nextMeetingNotes: r.next_meeting_notes,
    status: r.status, createdBy: r.created_by, attachments: r.attachments || [],
    createdAt: r.created_at, updatedAt: r.updated_at
  }));
}

export async function addMeetingMinutes(item: Omit<MeetingMinutes, 'id' | 'createdAt' | 'updatedAt'>): Promise<MeetingMinutes> {
  const { data, error } = await supabase.from('meeting_minutes').insert({
    meeting_number: item.meetingNumber, title: item.title, type: item.type,
    date: item.date || null, start_time: item.startTime, end_time: item.endTime,
    location: item.location, facilitator: item.facilitator, secretary: item.secretary,
    attendees: item.attendees, absentees: item.absentees, quorum: item.quorum,
    opening_notes: item.openingNotes, agenda_points: item.agendaPoints,
    closing_notes: item.closingNotes, next_meeting_date: item.nextMeetingDate || null,
    next_meeting_notes: item.nextMeetingNotes, status: item.status, created_by: item.createdBy
  }).select().single();
  if (error) throw error;
  return { ...item, id: data.id, createdAt: data.created_at, updatedAt: data.updated_at };
}

export async function updateMeetingMinutes(id: string, item: Partial<MeetingMinutes>): Promise<void> {
  await supabase.from('meeting_minutes').update({
    meeting_number: item.meetingNumber, title: item.title, type: item.type,
    date: item.date || null, start_time: item.startTime, end_time: item.endTime,
    location: item.location, facilitator: item.facilitator, secretary: item.secretary,
    attendees: item.attendees, absentees: item.absentees, quorum: item.quorum,
    opening_notes: item.openingNotes, agenda_points: item.agendaPoints,
    closing_notes: item.closingNotes, next_meeting_date: item.nextMeetingDate || null,
    next_meeting_notes: item.nextMeetingNotes, status: item.status,
    updated_at: new Date().toISOString()
  }).eq('id', id);
}

export async function deleteMeetingMinutes(id: string): Promise<void> {
  await supabase.from('meeting_minutes').delete().eq('id', id);
}

// ─── Achievements ─────────────────────────────────────────────────────────────

export async function fetchAchievements(): Promise<AchievementItem[]> {
  const { data } = await supabase.from('achievements').select('*').order('year', { ascending: false });
  return (data || []).map(r => ({
    id: r.id, title: r.title, year: r.year, category: r.category,
    description: r.description, organizer: r.organizer, certificateUrl: r.certificate_url
  }));
}
