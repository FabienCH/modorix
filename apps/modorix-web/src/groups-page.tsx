import { ModorixTable } from '@modorix-ui/components/modorix-table';
import '@modorix-ui/globals.css';

export default function GroupsPage() {
  const groupsData = [
    ['United States', 'For people living in US'],
    ['United Kingdom', 'For people living in UK'],
    ['Germany', 'For people living in Germany'],
    ['France', 'For people living in France'],
    ['Spain', 'For people living in Spain'],
    ['Scientists', 'For scientists or people working around science'],
    ['Streamers', 'For streamers or people working around streaming'],
    ['Influencers', 'For influencers or people working around influencers'],
    ['Journalists', 'For journalists or people working around journalism'],
    ['Artists', 'For artists or people working around arts'],
    ['Sports(wo)men', 'For sports(wo)men or people working around sports'],
  ];
  const columns = ['Group', 'Description'];
  return (
    <>
      <h1 className="text-xl pb-3 text-modorix-950">Groups</h1>
      <ModorixTable columns={columns} data={groupsData} emptyDataMessage="There is no groups yet"></ModorixTable>
    </>
  );
}
