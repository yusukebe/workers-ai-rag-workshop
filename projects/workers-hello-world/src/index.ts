export default {
  fetch: (req: Request, env) => {
    return Response.json({
      message: 'Hello',
      url: req.url,
      myVar: env.MY_VAR
    })
  }
} satisfies ExportedHandler<{ MY_VAR: string }>
