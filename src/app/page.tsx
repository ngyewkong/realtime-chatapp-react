import Button from "@/components/ui/Button";
import { db } from "@/lib/db";

export default async function Home() {

  // await db.set('hello', 'world')

  return (
    // create a button and use the custom variant we created ghost to make it transparent and appear when hovered
    <Button variant={'ghost'}>Click Me</Button>
  )
}
