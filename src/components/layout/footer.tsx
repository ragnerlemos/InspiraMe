export function Footer() {
  return (
    <footer className="mt-12 py-6 px-4 md:px-8 border-t border-t-black/10">
      <div className="container mx-auto text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} InspiraMe. All rights reserved.</p>
      </div>
    </footer>
  );
}
