import { supabase } from './supabase';
import {
  initialSiteSettings, initialNews, initialBoardMembers,
  initialPrograms, initialAgenda, initialGallery, initialFAQs,
  initialMembers, initialRegistrations, initialMeetingMinutes, initialAchievements
} from '../data/initialData';
import { saveSiteSettings } from './supabaseService';

export async function seedInitialDataIfEmpty() {
  const isSeeded = typeof window !== 'undefined' ? localStorage.getItem('KT_DB_SEEDED_V2') : null;
  if (isSeeded) {
    console.log('[Supabase] Already seeded before.');
    return;
  }

  console.log('[Supabase] Checking and seeding initial data if empty...');
  try {
    // 1. Site Settings
    const { data: sData } = await supabase.from('site_settings').select('id').limit(1);
    if (!sData || sData.length === 0) {
      console.log('[Supabase] Seeding site_settings...');
      await saveSiteSettings(initialSiteSettings);
    }

    // 2. News
    const { data: nData } = await supabase.from('news').select('id').limit(1);
    if (!nData || nData.length === 0) {
      console.log('[Supabase] Seeding news...');
      for (const item of initialNews) {
        await supabase.from('news').upsert({
          id: item.id, title: item.title, slug: item.slug, summary: item.summary,
          content: item.content, category: item.category, author: item.author,
          date: item.date, thumbnail: item.thumbnail, status: item.status, views: item.views || 0
        });
      }
    }

    // 3. Board Members
    const { data: bData } = await supabase.from('board_members').select('id').limit(1);
    if (!bData || bData.length === 0) {
      console.log('[Supabase] Seeding board_members...');
      for (const item of initialBoardMembers) {
        await supabase.from('board_members').upsert({
          id: item.id, name: item.name, position: item.position, period: item.period,
          photo: item.photo, order: item.order, phone: item.phone, email: item.email, instagram: item.instagram
        });
      }
    }

    // 4. Programs
    const { data: pData } = await supabase.from('programs').select('id').limit(1);
    if (!pData || pData.length === 0) {
      console.log('[Supabase] Seeding programs...');
      for (const item of initialPrograms) {
        await supabase.from('programs').upsert({
          id: item.id, title: item.title, description: item.description, full_details: item.fullDetails,
          category: item.category, status: item.status, target: item.target, budget: item.budget,
          image: item.image, coordinator: item.coordinator
        });
      }
    }

    // 5. Agenda
    const { data: aData } = await supabase.from('agenda').select('id').limit(1);
    if (!aData || aData.length === 0) {
      console.log('[Supabase] Seeding agenda...');
      for (const item of initialAgenda) {
        await supabase.from('agenda').upsert({
          id: item.id, title: item.title, description: item.description, date: item.date || null,
          time: item.time, location: item.location, maps_url: item.mapsUrl, poster: item.poster,
          images: item.images || [], status: item.status, category: item.category
        });
      }
    }

    // 6. Gallery
    const { data: gData } = await supabase.from('gallery').select('id').limit(1);
    if (!gData || gData.length === 0) {
      console.log('[Supabase] Seeding gallery...');
      for (const item of initialGallery) {
        await supabase.from('gallery').upsert({
          id: item.id, title: item.title, caption: item.caption, category: item.category,
          type: item.type, url: item.url, date: item.date
        });
      }
    }

    // 7. FAQs
    const { data: fData } = await supabase.from('faqs').select('id').limit(1);
    if (!fData || fData.length === 0) {
      console.log('[Supabase] Seeding faqs...');
      for (const item of initialFAQs) {
        await supabase.from('faqs').upsert({
          id: item.id, question: item.question, answer: item.answer, category: item.category
        });
      }
    }

    // 8. Members
    const { data: mData } = await supabase.from('members').select('id').limit(1);
    if (!mData || mData.length === 0) {
      console.log('[Supabase] Seeding members...');
      for (const item of initialMembers) {
        await supabase.from('members').upsert({
          id: item.id, registration_id: item.registrationId, full_name: item.fullName,
          gender: item.gender, address: item.address, rt_rw: item.rtRw, whatsapp: item.whatsapp,
          email: item.email, interests: item.interests, status: item.status,
          joined_date: item.joinedDate, avatar: item.avatar
        });
      }
    }

    // 9. Registrations
    const { data: rData } = await supabase.from('registrations').select('id').limit(1);
    if (!rData || rData.length === 0) {
      console.log('[Supabase] Seeding registrations...');
      for (const item of initialRegistrations) {
        await supabase.from('registrations').upsert({
          id: item.id, full_name: item.fullName, pob: item.pob, dob: item.dob, gender: item.gender,
          address: item.address, rt_rw: item.rtRw, whatsapp: item.whatsapp, email: item.email,
          education: item.education, occupation: item.occupation, interests: item.interests,
          motivation: item.motivation, org_experience: item.orgExperience, photo_url: item.photoUrl || null,
          document_url: item.documentUrl || null, status: item.status, applied_at: item.appliedAt,
          member_id: item.memberId, processed_at: item.processedAt
        });
      }
    }

    // 10. Meeting Minutes
    const { data: mmData } = await supabase.from('meeting_minutes').select('id').limit(1);
    if (!mmData || mmData.length === 0) {
      console.log('[Supabase] Seeding meeting_minutes...');
      for (const item of initialMeetingMinutes) {
        await supabase.from('meeting_minutes').upsert({
          id: item.id, meeting_number: item.meetingNumber, title: item.title, type: item.type,
          date: item.date || null, start_time: item.startTime, end_time: item.endTime,
          location: item.location, facilitator: item.facilitator, secretary: item.secretary,
          attendees: item.attendees, absentees: item.absentees, quorum: item.quorum,
          opening_notes: item.openingNotes, agenda_points: item.agendaPoints,
          closing_notes: item.closingNotes, next_meeting_date: item.nextMeetingDate || null,
          next_meeting_notes: item.nextMeetingNotes, status: item.status, created_by: item.createdBy
        });
      }
    }

    // 11. Achievements
    const { data: achData } = await supabase.from('achievements').select('id').limit(1);
    if (!achData || achData.length === 0) {
      console.log('[Supabase] Seeding achievements...');
      for (const item of initialAchievements) {
        await supabase.from('achievements').upsert({
          id: item.id, title: item.title, year: item.year, category: item.category,
          description: item.description, organizer: item.organizer, certificate_url: item.certificateUrl
        });
      }
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('KT_DB_SEEDED_V2', 'true');
    }
    console.log('[Supabase] Seeding complete!');
  } catch (err) {
    console.error('[Supabase] Error during auto-seeding:', err);
  }
}
