import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Loading } from '../components/Loading';
import { MATERIALS } from '../data/materials';
import type { CollectionPointInput, MaterialId } from '../domain/types';
import { usePageTitle } from '../hooks/usePageTitle';
import { pointRepository } from '../services/container';
import { geocodeAddress } from '../services/geo';

interface FormValues {
  name: string;
  address: string;
  neighborhood: string;
  openingHours: string;
  phone: string;
  lat: string;
  lng: string;
  materials: MaterialId[];
}

type Errors = Partial<Record<keyof FormValues, string>>;

const EMPTY: FormValues = { name: '', address: '', neighborhood: '', openingHours: '', phone: '', lat: '', lng: '', materials: [] };

function parseCoordinate(value: string): number {
  return value.trim() === '' ? Number.NaN : Number(value.replace(',', '.'));
}

function validate(values: FormValues): Errors {
  const errors: Errors = {};
  if (!values.name.trim()) errors.name = 'Informe o nome do ponto.';
  if (!values.address.trim()) errors.address = 'Informe o endereço.';
  if (!values.neighborhood.trim()) errors.neighborhood = 'Informe o bairro.';
  if (!values.openingHours.trim()) errors.openingHours = 'Informe o horário de funcionamento.';
  const lat = parseCoordinate(values.lat);
  const lng = parseCoordinate(values.lng);
  if (!Number.isFinite(lat) || lat < -90 || lat > 90) errors.lat = 'Use um número entre -90 e 90, como -23,5015.';
  if (!Number.isFinite(lng) || lng < -180 || lng > 180) errors.lng = 'Use um número entre -180 e 180, como -47,458.';
  if (values.materials.length === 0) errors.materials = 'Selecione ao menos um material.';
  return errors;
}

/** Requisito 12: cadastro e edição de pontos de coleta. */
export default function PointFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  usePageTitle(isEditing ? 'Editar ponto de coleta' : 'Novo ponto de coleta');

  const [values, setValues] = useState<FormValues | null>(isEditing ? null : EMPTY);
  const [notFound, setNotFound] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [geoMessage, setGeoMessage] = useState<string | null>(null);
  const [geoBusy, setGeoBusy] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;
    let current = true;
    void pointRepository.getById(id).then((point) => {
      if (!current) return;
      if (!point) {
        setNotFound(true);
        return;
      }
      setValues({
        name: point.name,
        address: point.address,
        neighborhood: point.neighborhood,
        openingHours: point.openingHours,
        phone: point.phone ?? '',
        lat: String(point.lat),
        lng: String(point.lng),
        materials: point.materials,
      });
    });
    return () => {
      current = false;
    };
  }, [id]);

  if (notFound) {
    return (
      <section className="section container empty-state">
        <h1>Ponto de coleta não encontrado</h1>
        <Link to="/admin" className="button button--primary">Voltar à lista</Link>
      </section>
    );
  }
  if (!values) return <Loading />;
  const form = values;

  function set<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues({ ...form, [key]: value });
  }

  function toggleMaterial(material: MaterialId, checked: boolean) {
    set('materials', checked ? [...form.materials, material] : form.materials.filter((item) => item !== material));
  }

  async function findCoordinates() {
    const address = [form.address, form.neighborhood].filter((part) => part.trim()).join(', ');
    if (!address) {
      setGeoMessage('Preencha o endereço primeiro.');
      return;
    }
    setGeoBusy(true);
    setGeoMessage(null);
    try {
      const found = await geocodeAddress(address);
      if (found) {
        setValues({ ...form, lat: String(found.lat), lng: String(found.lng) });
        setGeoMessage('Coordenadas preenchidas. Confira no mapa após salvar.');
      } else {
        setGeoMessage('Endereço não encontrado em Sorocaba. Preencha as coordenadas manualmente.');
      }
    } catch {
      setGeoMessage('Não foi possível buscar agora. Preencha as coordenadas manualmente.');
    } finally {
      setGeoBusy(false);
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      summaryRef.current?.focus();
      return;
    }
    const input: CollectionPointInput = {
      name: form.name.trim(),
      address: form.address.trim(),
      neighborhood: form.neighborhood.trim(),
      city: 'Sorocaba',
      openingHours: form.openingHours.trim(),
      phone: form.phone.trim() || undefined,
      lat: parseCoordinate(form.lat),
      lng: parseCoordinate(form.lng),
      materials: form.materials,
    };
    if (id) await pointRepository.update(id, input);
    else await pointRepository.create(input);
    navigate('/admin', { state: { message: `${input.name} foi salvo.` } });
  }

  function textField(key: 'name' | 'address' | 'neighborhood' | 'openingHours' | 'phone' | 'lat' | 'lng', label: string, options: { hint?: string; mode?: 'decimal' | 'tel' } = {}) {
    const errorId = `${key}-erro`;
    const hintId = `${key}-dica`;
    const described = [errors[key] && errorId, options.hint && hintId].filter(Boolean).join(' ');
    return (
      <div className="field">
        <label htmlFor={key}>{label}</label>
        <input
          id={key}
          value={form[key]}
          inputMode={options.mode}
          type={options.mode === 'tel' ? 'tel' : 'text'}
          onChange={(event) => set(key, event.target.value)}
          aria-invalid={Boolean(errors[key])}
          aria-describedby={described || undefined}
        />
        {options.hint && <span id={hintId} className="field__hint">{options.hint}</span>}
        {errors[key] && <p id={errorId} className="field-error">{errors[key]}</p>}
      </div>
    );
  }

  const errorCount = Object.keys(errors).length;

  return (
    <section className="section container" style={{ maxWidth: 780 }}>
      <Link to="/admin" className="back-link">← Voltar à lista</Link>
      <h1 style={{ marginTop: '0.75rem', fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)' }}>
        {isEditing ? 'Editar ponto de coleta' : 'Novo ponto de coleta'}
      </h1>

      <form className="form" onSubmit={(event) => void handleSubmit(event)} noValidate>
        <div ref={summaryRef} tabIndex={-1} role="alert">
          {errorCount > 0 && (
            <p className="error-summary">
              {errorCount === 1 ? 'Corrija 1 campo para salvar.' : `Corrija ${errorCount} campos para salvar.`}
            </p>
          )}
        </div>

        {textField('name', 'Nome do ponto')}
        <div className="form-row">
          {textField('address', 'Endereço', { hint: 'Rua e número' })}
          {textField('neighborhood', 'Bairro')}
        </div>
        <div className="form-row">
          {textField('openingHours', 'Horário de funcionamento', { hint: 'Ex.: Segunda a sexta, das 8h às 17h' })}
          {textField('phone', 'Telefone (opcional)', { mode: 'tel' })}
        </div>
        <div className="form-row">
          {textField('lat', 'Latitude', { mode: 'decimal' })}
          {textField('lng', 'Longitude', { mode: 'decimal' })}
        </div>
        <div>
          <button type="button" className="button button--secondary button--small" onClick={() => void findCoordinates()} disabled={geoBusy}>
            {geoBusy ? 'Buscando…' : 'Buscar coordenadas pelo endereço'}
          </button>
          <div role="status">{geoMessage && <span className="field__hint">{geoMessage}</span>}</div>
        </div>

        <fieldset className="field" aria-describedby={errors.materials ? 'materiais-erro' : undefined}>
          <legend>Materiais aceitos</legend>
          <div className="checkbox-grid">
            {MATERIALS.map((material) => (
              <label key={material.id}>
                <input
                  type="checkbox"
                  checked={form.materials.includes(material.id)}
                  onChange={(event) => toggleMaterial(material.id, event.target.checked)}
                />
                {material.name}
              </label>
            ))}
          </div>
          {errors.materials && <p id="materiais-erro" className="field-error">{errors.materials}</p>}
        </fieldset>

        <div className="form-actions">
          <button type="submit" className="button button--primary">Salvar</button>
          <Link to="/admin" className="button button--secondary">Cancelar</Link>
        </div>
      </form>
    </section>
  );
}
