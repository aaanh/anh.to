import { useRouter } from 'next/router'
import { promises as fs } from 'fs'

export default async function Redirect() {
  const router = useRouter();
  const source = router.query.redirect;

  const file = await fs.readFile(process.cwd() + '/src/redirects.json', 'utf8')
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const data = JSON.parse(file).redirects;

  console.log(data)

  return null;
}