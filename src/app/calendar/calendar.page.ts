import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarOptions } from '@fullcalendar/core';
import { environment } from 'src/environments/environment';
import axios from 'axios';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  time: string;
  interval: number;
  color: string;
  form: 'tablet' | 'syrup';
  startDate: string;
  endDate: string;
  expiryDate: string;
  quantity: string;
  measurement: string;
  container: string;
  taken: boolean;
}

@Component({
  selector: 'app-tab1',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    FullCalendarModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CalendarPage implements OnInit {
  allMedications: any[] = [];

  currentTime: string = '';
  selectedDate: string = new Date().toISOString().split('T')[0];
  showMedicationSection: boolean = false;
  isModalOpen: boolean = false;
  isEditing: boolean = false;
  editingMedicationId: string | null = null;
  showAllMedications: boolean = false;
  isEditLimited: boolean = false;

  medications: { [key: string]: Medication[] } = {};

  newMedication: Medication = {
    id: '',
    name: '',
    dosage: '',
    time: '',
    interval: 0,
    color: '#00A9C1',
    form: 'tablet',
    startDate: '',
    endDate: '',
    expiryDate: '',
    quantity: '',
    measurement: '',
    container: 'A1',
    taken: false,
  };

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek',
    },
    events: [],
    editable: true,
    selectable: true,
    initialDate: this.selectedDate,
    height: 'auto',
    aspectRatio: window.innerWidth < 768 ? 1.1 : 1.5,
    expandRows: true,
    handleWindowResize: true,
    contentHeight: 'auto',
    dayMaxEventRows: true,
    dayMaxEvents: true,
    titleFormat: { year: 'numeric', month: 'long' },
    buttonText: {
      today: 'Today',
      month: 'Month',
      week: 'Week',
    },
    select: (selectionInfo) => {
      this.selectedDate = selectionInfo.startStr;
      console.log('Date selected:', this.selectedDate);
    },
    dateClick: (info) => {
      this.selectedDate = info.dateStr;
      console.log('Date clicked:', this.selectedDate);
    },
    eventClick: (info) => {
      const clickedDate = new Date(info.event.start!);
      this.selectedDate = clickedDate.toISOString().split('T')[0];
      console.log('Event clicked:', this.selectedDate);
    },
  };

  constructor(private router: Router) {
    // Add window resize handler
    window.addEventListener('resize', () => {
      this.calendarOptions.aspectRatio = window.innerWidth < 768 ? 1.1 : 1.5;
    });
  }

  ngOnInit() {
    this.updateTime();
    setInterval(() => this.updateTime(), 1000);
    this.loadMedications();
  }

  getTimeOfDay(): string {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return 'morning';
    } else if (hour >= 12 && hour < 17) {
      return 'afternoon';
    } else if (hour >= 17 && hour < 22) {
      return 'evening';
    } else {
      return 'night';
    }
  }

  isMorning(): boolean {
    const hour = new Date().getHours();
    return hour >= 5 && hour < 12;
  }

  isAfternoon(): boolean {
    const hour = new Date().getHours();
    return hour >= 12 && hour < 17;
  }

  isEvening(): boolean {
    const hour = new Date().getHours();
    return hour >= 17 && hour < 22;
  }

  isNight(): boolean {
    const hour = new Date().getHours();
    return hour >= 22 || hour < 5;
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return 'Good Morning';
    } else if (hour >= 12 && hour < 17) {
      return 'Good Afternoon';
    } else if (hour >= 17 && hour < 22) {
      return 'Good Evening';
    } else {
      return 'Good Night';
    }
  }

  updateTime() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes < 10 ? '0' + minutes : minutes;

    this.currentTime = `${this.getGreeting()}, it's ${displayHours}:${displayMinutes} ${ampm}`;
  }

  toggleViewMode() {
    this.showAllMedications = !this.showAllMedications;
  }

  getMedicationsForDisplay(): Medication[] {
    if (this.showAllMedications) {
      return this.allMedications;
    }
    return this.getMedicationsForDate(this.selectedDate);
  }

  getMedicationsForDate(date: string): Medication[] {
    return this.medications[date] || [];
  }

  loadMedications() {
    try {
      const savedAllMedications = localStorage.getItem('allMedications');
      const savedMedications = localStorage.getItem('medications');
      const savedEvents = localStorage.getItem('calendarEvents');

      if (savedAllMedications) {
        this.allMedications = JSON.parse(savedAllMedications);
      }
      if (savedMedications) {
        this.medications = JSON.parse(savedMedications);
      }
      if (savedEvents) {
        this.calendarOptions.events = JSON.parse(savedEvents);
      }
    } catch (e) {
      console.error('Error loading medications:', e);
    }
  }

  saveMedications() {
    try {
      localStorage.setItem(
        'allMedications',
        JSON.stringify(this.allMedications)
      );
      localStorage.setItem('medications', JSON.stringify(this.medications));
      localStorage.setItem(
        'calendarEvents',
        JSON.stringify(this.calendarOptions.events)
      );
    } catch (e) {
      console.error('Error saving medications:', e);
    }
  }

  generateUniqueId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }

  openAddReminderModal() {
    this.isModalOpen = true;
    this.isEditLimited = false;
  }

  closeModal() {
    this.isModalOpen = false;
    this.resetMedicationForm();
    this.isEditLimited = false;
  }

  addMedication() {
    if (
      this.newMedication.name &&
      this.newMedication.startDate &&
      this.newMedication.endDate
    ) {
      const dosage = this.newMedication.quantity
        ? `${this.newMedication.quantity} ${
            this.newMedication.measurement || 'pcs'
          }`
        : '';

      if (this.isEditing && this.editingMedicationId) {
        this.updateMedication(dosage);
      } else {
        this.createNewMedication(dosage);
      }

      this.closeModal();
    } else {
      alert('Please fill out all required fields (Name, Start Date, End Date)');
    }
  }

  createNewMedication(dosage: string) {
    const medicationId = this.generateUniqueId();
    const medicationToAdd = {
      ...this.newMedication,
      id: medicationId,
      dosage: dosage,
    };

    const startDate = new Date(this.newMedication.startDate);
    const endDate = new Date(this.newMedication.endDate);

    this.allMedications.push({ ...medicationToAdd });

    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dateKey = currentDate.toISOString().split('T')[0];
      if (!this.medications[dateKey]) {
        this.medications[dateKey] = [];
      }
      this.medications[dateKey].push({ ...medicationToAdd });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    const event = {
      title: medicationToAdd.name,
      start: medicationToAdd.startDate,
      end: new Date(new Date(medicationToAdd.endDate).getTime() + 86400000),
      color: medicationToAdd.color,
      extendedProps: { medicationId: medicationId },
      display: 'block', // This makes the event fill the day cell
    };

    this.calendarOptions.events = [
      ...(this.calendarOptions.events as any[]),
      event,
    ];

    this.saveMedications();
  }

  editMedication(medicationId: string) {
    const medication = this.allMedications.find(
      (med) => med.id === medicationId
    );
    if (medication) {
      this.newMedication = { ...medication };
      this.isEditing = true;
      this.editingMedicationId = medicationId;
      this.isEditLimited = true;
      this.isModalOpen = true;
    }
  }

  updateMedication(dosage: string) {
    if (this.editingMedicationId) {
      Object.keys(this.medications).forEach((dateKey) => {
        this.medications[dateKey] = this.medications[dateKey].filter(
          (med) => med.id !== this.editingMedicationId
        );
        if (this.medications[dateKey].length === 0) {
          delete this.medications[dateKey];
        }
      });

      const index = this.allMedications.findIndex(
        (med) => med.id === this.editingMedicationId
      );
      if (index !== -1) {
        this.allMedications.splice(index, 1);
      }

      const events = this.calendarOptions.events as any[];
      this.calendarOptions.events = events.filter(
        (event) =>
          event.extendedProps?.medicationId !== this.editingMedicationId
      );

      this.createNewMedication(dosage);
    }
  }

  deleteMedication(medicationId: string) {
    if (confirm('Are you sure you want to delete this medication?')) {
      const index = this.allMedications.findIndex(
        (med) => med.id === medicationId
      );
      if (index !== -1) {
        this.allMedications.splice(index, 1);
      }

      Object.keys(this.medications).forEach((dateKey) => {
        this.medications[dateKey] = this.medications[dateKey].filter(
          (med) => med.id !== medicationId
        );
        if (this.medications[dateKey].length === 0) {
          delete this.medications[dateKey];
        }
      });

      const events = this.calendarOptions.events as any[];
      this.calendarOptions.events = events.filter(
        (event) => event.extendedProps?.medicationId !== medicationId
      );

      this.saveMedications();
    }
  }

  resetMedicationForm() {
    this.isEditing = false;
    this.editingMedicationId = null;
    this.newMedication = {
      id: '',
      name: '',
      dosage: '',
      time: '',
      interval: 0,
      color: '#00A9C1',
      form: 'tablet',
      startDate: '',
      endDate: '',
      expiryDate: '',
      quantity: '',
      measurement: '',
      container: 'A1',
      taken: false,
    };
  }

  formatTimeWithAMPM(time: string): string {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    let hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'pm' : 'am';
    hour = hour % 12;
    hour = hour ? hour : 12; // Convert 0 to 12
    return `Time: ${hour}:${minutes} ${ampm}`;
  }

  onMedicineFormChange() {
    // Reset container when medicine form changes
    this.newMedication.container = '';
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  get token(): string {
    return localStorage.getItem('access_token') || '';
  }

  async getSchedules() {
    try {
      const response = await axios.get(
        `${environment.urls.api}/get/schedules`,
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }
      );
      if (response.status === 200) {
        this.allMedications = response.data;
        console.log(this.allMedications);
      }
    } catch (error) {
      console.error('Error fetching schedules:', error);
    }
  }
}
