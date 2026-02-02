import React, { useEffect, useState } from 'react';
import { api, setToken, clearToken } from './services/api';

const initialAuth = {
  email: '',
  password: '',
  fullName: '',
  role: 'patient'
};

export default function App() {
  const [authForm, setAuthForm] = useState(initialAuth);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [patients, setPatients] = useState({ userId: '', documentId: '', birthDate: '', phone: '' });
  const [providers, setProviders] = useState({ userId: '', crm: '', specialty: '', organization: '' });
  const [appointments, setAppointments] = useState({ patientId: '', providerId: '', scheduledAt: '', type: 'telemed', status: 'scheduled' });
  const [triage, setTriage] = useState({ patientId: '', symptoms: '', severity: 'low' });
  const [telemed, setTelemed] = useState({ appointmentId: '' });
  const [appointmentsList, setAppointmentsList] = useState([]);

  useEffect(() => {
    api.me()
      .then((data) => setUser(data.user))
      .catch(() => setUser(null));
  }, []);

  function handleAuthChange(event) {
    setAuthForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  }

  async function handleRegister(event) {
    event.preventDefault();
    setError('');
    try {
      const data = await api.register(authForm);
      setToken(data.token);
      setUser(data.user);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleLogin(event) {
    event.preventDefault();
    setError('');
    try {
      const data = await api.login({ email: authForm.email, password: authForm.password });
      setToken(data.token);
      setUser(data.user);
    } catch (err) {
      setError(err.message);
    }
  }

  function handleLogout() {
    clearToken();
    setUser(null);
  }

  async function handleCreatePatient(event) {
    event.preventDefault();
    setError('');
    try {
      await api.createPatient(patients);
      setPatients({ userId: '', documentId: '', birthDate: '', phone: '' });
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleCreateProvider(event) {
    event.preventDefault();
    setError('');
    try {
      await api.createProvider(providers);
      setProviders({ userId: '', crm: '', specialty: '', organization: '' });
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleCreateAppointment(event) {
    event.preventDefault();
    setError('');
    try {
      await api.createAppointment(appointments);
      setAppointments({ patientId: '', providerId: '', scheduledAt: '', type: 'telemed', status: 'scheduled' });
      const list = await api.listAppointments();
      setAppointmentsList(list.appointments);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleTriage(event) {
    event.preventDefault();
    setError('');
    try {
      await api.triageIntake({
        patientId: triage.patientId,
        symptoms: triage.symptoms.split(',').map((item) => item.trim()).filter(Boolean),
        severity: triage.severity
      });
      setTriage({ patientId: '', symptoms: '', severity: 'low' });
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleTelemed(event) {
    event.preventDefault();
    setError('');
    try {
      await api.createTelemed(telemed);
      setTelemed({ appointmentId: '' });
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="container">
      <header>
        <div>
          <h1>VITAHUB</h1>
          <p>Plataforma integrada de saúde digital</p>
        </div>
        {user ? (
          <div className="user">
            <span>{user.full_name || user.fullName}</span>
            <button type="button" onClick={handleLogout}>Sair</button>
          </div>
        ) : null}
      </header>

      {error ? <div className="error">{error}</div> : null}

      {!user ? (
        <section className="card">
          <h2>Autenticação</h2>
          <form className="grid" onSubmit={handleRegister}>
            <input name="fullName" placeholder="Nome completo" value={authForm.fullName} onChange={handleAuthChange} />
            <input name="email" placeholder="E-mail" value={authForm.email} onChange={handleAuthChange} />
            <input name="password" placeholder="Senha" type="password" value={authForm.password} onChange={handleAuthChange} />
            <select name="role" value={authForm.role} onChange={handleAuthChange}>
              <option value="patient">Paciente</option>
              <option value="provider">Médico</option>
              <option value="admin">Admin</option>
            </select>
            <button type="submit">Registrar</button>
            <button type="button" onClick={handleLogin}>Entrar</button>
          </form>
        </section>
      ) : (
        <section className="grid-two">
          <div className="card">
            <h2>Cadastrar paciente</h2>
            <form onSubmit={handleCreatePatient}>
              <input placeholder="User ID" value={patients.userId} onChange={(e) => setPatients({ ...patients, userId: e.target.value })} />
              <input placeholder="Documento" value={patients.documentId} onChange={(e) => setPatients({ ...patients, documentId: e.target.value })} />
              <input placeholder="Nascimento (YYYY-MM-DD)" value={patients.birthDate} onChange={(e) => setPatients({ ...patients, birthDate: e.target.value })} />
              <input placeholder="Telefone" value={patients.phone} onChange={(e) => setPatients({ ...patients, phone: e.target.value })} />
              <button type="submit">Salvar</button>
            </form>
          </div>

          <div className="card">
            <h2>Cadastrar profissional</h2>
            <form onSubmit={handleCreateProvider}>
              <input placeholder="User ID" value={providers.userId} onChange={(e) => setProviders({ ...providers, userId: e.target.value })} />
              <input placeholder="CRM" value={providers.crm} onChange={(e) => setProviders({ ...providers, crm: e.target.value })} />
              <input placeholder="Especialidade" value={providers.specialty} onChange={(e) => setProviders({ ...providers, specialty: e.target.value })} />
              <input placeholder="Organização" value={providers.organization} onChange={(e) => setProviders({ ...providers, organization: e.target.value })} />
              <button type="submit">Salvar</button>
            </form>
          </div>

          <div className="card">
            <h2>Agendar consulta</h2>
            <form onSubmit={handleCreateAppointment}>
              <input placeholder="Patient ID" value={appointments.patientId} onChange={(e) => setAppointments({ ...appointments, patientId: e.target.value })} />
              <input placeholder="Provider ID" value={appointments.providerId} onChange={(e) => setAppointments({ ...appointments, providerId: e.target.value })} />
              <input placeholder="Data/Hora (ISO)" value={appointments.scheduledAt} onChange={(e) => setAppointments({ ...appointments, scheduledAt: e.target.value })} />
              <select value={appointments.type} onChange={(e) => setAppointments({ ...appointments, type: e.target.value })}>
                <option value="telemed">Telemedicina</option>
                <option value="in_person">Presencial</option>
                <option value="home">Domiciliar</option>
              </select>
              <button type="submit">Agendar</button>
            </form>
            <ul>
              {appointmentsList.map((appointment) => (
                <li key={appointment.id}>{appointment.id} - {appointment.status}</li>
              ))}
            </ul>
          </div>

          <div className="card">
            <h2>Triagem IA</h2>
            <form onSubmit={handleTriage}>
              <input placeholder="Patient ID" value={triage.patientId} onChange={(e) => setTriage({ ...triage, patientId: e.target.value })} />
              <input placeholder="Sintomas (separados por ,)" value={triage.symptoms} onChange={(e) => setTriage({ ...triage, symptoms: e.target.value })} />
              <select value={triage.severity} onChange={(e) => setTriage({ ...triage, severity: e.target.value })}>
                <option value="low">Leve</option>
                <option value="medium">Moderado</option>
                <option value="high">Grave</option>
              </select>
              <button type="submit">Enviar</button>
            </form>
          </div>

          <div className="card">
            <h2>Telemedicina</h2>
            <form onSubmit={handleTelemed}>
              <input placeholder="Appointment ID" value={telemed.appointmentId} onChange={(e) => setTelemed({ ...telemed, appointmentId: e.target.value })} />
              <button type="submit">Criar sessão</button>
            </form>
          </div>
        </section>
      )}
    </div>
  );
}
