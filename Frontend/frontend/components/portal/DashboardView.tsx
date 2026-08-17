'use client';
import {useQuery} from '@tanstack/react-query';
import {api} from '@/lib/api';
import {Icon} from '@/components/ui/Icon';

type BootstrapData={
  stats?:{label:string;value:string}[];
  notices?:Record<string,unknown>[];
  timetable?:Record<string,unknown>[];
};

export function DashboardView(){
  const query=useQuery({
    queryKey:['dashboard','bootstrap'],
    queryFn:async()=> (await api.get<BootstrapData>('/dashboard/bootstrap')).data,
    staleTime:30_000
  });
  const data=query.data;
  const notices=data?.notices||[];
  const schedule=data?.timetable||[];
  const error=query.error instanceof Error?query.error.message:'';

  return <>
    <div className="page-heading"><div><span className="eyebrow">Live workspace</span><h1>Dashboard</h1><p>Real-time school data from the ERP backend.</p></div><button className="btn btn-secondary" onClick={()=>query.refetch()} disabled={query.isFetching}><Icon name="clock" size={15}/> {query.isFetching?'Refreshing...':'Refresh'}</button></div>
    {error&&<div className="panel" style={{padding:16,color:'#b91c1c'}}>{error}</div>}
    <section className="portal-stats">{(data?.stats||[]).map((s,i)=><article className="stat-card" key={s.label}><div className="stat-card-top"><span className="stat-icon"><Icon name={['school','student','teacher','wallet'][i%4] as 'school'} /></span></div><div><p>{s.label}</p><strong>{s.value}</strong></div></article>)}</section>
    <section className="dashboard-layout"><div className="panel"><div className="panel-head"><div><span className="eyebrow">Schedule</span><h2>Timetable</h2></div></div><div className="notice-list">{schedule.length?schedule.map((x,i)=><div className="notice-item" key={i}><span className="notice-icon blue"><Icon name="clock" size={16}/></span><div><strong>{String(x.day||'Schedule')}</strong><p>{Array.isArray(x.periods)?`${x.periods.length} periods`:'Academic timetable'}</p></div></div>):<p className="muted-label">No timetable records yet.</p>}</div></div><div className="panel"><div className="panel-head"><div><span className="eyebrow">Updates</span><h2>Recent notices</h2></div></div><div className="notice-list">{notices.length?notices.map((x,i)=><div className="notice-item" key={i}><span className="notice-icon amber"><Icon name="bell" size={16}/></span><div><strong>{String(x.title||'Notice')}</strong><p>{String(x.body||'')}</p></div></div>):<p className="muted-label">No notices yet.</p>}</div></div></section>
  </>;
}
